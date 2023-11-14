//
//  NetworkUnitTests.swift
//  SugarTests
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import XCTest
@testable import Sugar

final class NetworkUnitTests: XCTestCase {
    private var session: URLSession!
    private var url: URL!
    
    override func setUp() {
        url = URL(string: "https://themealdb.com/api/json/v1/1/filter.php?c=Dessert")
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [MockURLSessionProtocol.self]
        session = URLSession(configuration: configuration)
    }
    
    override func tearDown() {
        url = nil
        session = nil
        super.tearDown()
    }
    
    
    func testSuccessfulResponseCode() async throws {
        
        guard let path = Bundle.main.path(forResource: "desserts_valid_response", ofType: "json"),
              let data = FileManager.default.contents(atPath: path) else {
            XCTFail("Failed to get the static users file")
            return
        }
        MockURLSessionProtocol.loadingHandler = {
            let response = HTTPURLResponse(url: self.url,
                                           statusCode: 200,
                                           httpVersion: nil,
                                           headerFields: nil)
            return (response!, data)
        }
        let dataResponse = try await MockAPIServiceManager.shared.request(session: session,
                                                                          from: "Dummy",
                                                                          type: Desserts.self)
        let staticJSON = try JSONMapper.decode(file: "desserts_valid_response",
                                               type: Desserts.self)
        
        XCTAssertEqual(dataResponse.desserts, staticJSON.desserts)
    }
    
    func testUnsuccessfulResponseCode() async  {
        let invalidStatusCode = 400
        MockURLSessionProtocol.loadingHandler = {
            let response = HTTPURLResponse(url: self.url,
                                           statusCode: invalidStatusCode,
                                           httpVersion: nil,
                                           headerFields: nil)
            return (response!, nil)
        }
        do {
            _ = try await MockAPIServiceManager.shared.request(session: session,
                                                               from: "Dummy",
                                                               type: Desserts.self)
        } catch {
            guard let networkingError = error as? APIError else {
                XCTFail("Got the wrong type of error, expecting NetworkingManager NetworkingError")
                return
            }
            XCTAssertEqual(networkingError,
                           APIError.invalidStatusCode(statusCode: invalidStatusCode),
                           "Error should be a networking error which throws an invalid status code")
        }
    }
}



