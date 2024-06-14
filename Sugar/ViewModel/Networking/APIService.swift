//
//  APIService.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import UIKit

protocol APIServiceProtocol {
    func fetchData<T : Codable>(using url: URL, for type: T.Type) async throws -> T
    func downloadImage(using url: URL, for id: String) async throws -> UIImage?
}

struct APIService: APIServiceProtocol {
    static let shared = APIService()
    private var dessertImageCache = NSCache<NSString, UIImage>()

    func fetchData<T: Codable>(using url: URL, for type: T.Type) async throws -> T  {
        let request = URLRequest(url: url)
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw APIError.invalidStatusCode
        }
        do {
           return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw APIError.failedToDecode
        }
    }
    
    func downloadImage(using url: URL, for id: String) async throws -> UIImage? {
        let key = NSString(string: id)
        if let cachedImage = dessertImageCache.object(forKey: key) {
            return cachedImage
        }
        let request = URLRequest(url: url)
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw APIError.invalidStatusCode
        }
        guard let image = UIImage(data: data) else {
            throw APIError.failedToDecode
        }
        dessertImageCache.setObject(image, forKey: key)
        return image
    }
}
