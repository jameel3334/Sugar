//
//  MockAPIService.swift
//  SugarTests
//
//  Created by Mohammed Jameeluddin on 6/14/24.
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
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw APIError.invalidStatusCode
        }
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        let result = try decoder.decode(T.self, from: data)
        return result
    }
}
