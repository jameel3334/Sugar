//
//  MockAPIService.swift
//  SugarTests
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

final class MockAPIServiceManager {
    static let shared = MockAPIServiceManager()
    private init() {}
    
    func request <T: Codable>(session: URLSession = .shared,
                              from urlString: String,
                              type: T.Type) async throws -> T {
        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }
        let request = URLRequest(url: url)
        let (data, response) = try await session.data(for: request)
        guard let response = response as? HTTPURLResponse,
              (200...300) ~= response.statusCode else {
            let statusCode = (response as! HTTPURLResponse).statusCode
            throw APIError.invalidStatusCode(statusCode: statusCode)
        }
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        let res = try decoder.decode(T.self, from: data)
        return res
    }
}
