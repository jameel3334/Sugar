//
//  APIError.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import Foundation

enum APIError: Error {
    case invalidStatusCode
    case failedToDecode
    case invalidURL
    case invalidData
}
