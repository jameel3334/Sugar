//
//  APIService.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import Foundation

struct APIService: APIServiceProtocol {
    func fetchData<T: Codable>(using url: URL, for type: T.Type) async throws -> T {
        let request = URLRequest(url: url)
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, (200..<300).contains(httpResponse.statusCode) else {
            let statusCode = (response as! HTTPURLResponse).statusCode
            throw APIError.invalidStatusCode(statusCode: statusCode)
        }
        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw APIError.invalidData
        }
    }
}
