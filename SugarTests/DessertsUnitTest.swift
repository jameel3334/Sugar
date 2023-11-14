//
//  DessertsUnitTest.swift
//  SugarTests
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import XCTest
@testable import Sugar

final class DessertsUnitTest: XCTestCase {
    
    override func tearDown() {
        super.tearDown()
    }
    
    func testDecodeSuccess() {
        XCTAssertNoThrow(try JSONMapper.decode(file: "desserts_valid_response", type: Desserts.self), "Mapper shouldn't throw an error")
        let decodedModel = try? JSONMapper.decode(file: "desserts_valid_response", type: Desserts.self)
            XCTAssertNotNil(decodedModel, "User response shouldn't be nil")
            XCTAssertEqual(decodedModel?.desserts.count, 5)
            XCTAssertEqual(decodedModel?.desserts[0].title, "Apam balik")
            XCTAssertEqual(decodedModel?.desserts[2].id, "52768")
            XCTAssertEqual(decodedModel?.desserts[4].image, "https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg")
    }
    
    func testDecodeFailure() {
        let decodedModel = try? JSONMapper.decode(file: "desserts_invalid_response", type: Desserts.self)
        XCTAssertNil(decodedModel, "User response should be nil")
    }
}
