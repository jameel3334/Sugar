//
//  FovoriteUnitTest.swift
//  SugarTests
//
//  Created by Mohammed Jameeluddin on 11/13/23.
//

import XCTest
@testable import Sugar

class FavoriteUnitTest: XCTestCase {
    var favorite: FavoriteViewModel!
    var meal: Meal!
    
    override func setUpWithError() throws {
        favorite = FavoriteViewModel()
        meal = Meal(id: "",
                    title: "",
                    instructions: "",
                    imageURL: "",
                    ingredient1: nil,
                    ingredient2: nil,
                    ingredient3: nil,
                    ingredient4: nil,
                    ingredient5: nil,
                    ingredient6: nil,
                    ingredient7: nil,
                    ingredient8: nil,
                    ingredient9: nil,
                    ingredient10: nil,
                    ingredient11: nil,
                    ingredient12: nil,
                    ingredient13: nil,
                    ingredient14: nil,
                    ingredient15: nil,
                    ingredient16: nil,
                    ingredient17: nil,
                    ingredient18: nil,
                    ingredient19: nil,
                    ingredient20: nil,
                    measure1: nil,
                    measure2: nil,
                    measure3: nil,
                    measure4: nil,
                    measure5: nil,
                    measure6: nil,
                    measure7: nil,
                    measure8: nil,
                    measure9: nil,
                    measure10: nil,
                    measure11: nil,
                    measure12: nil,
                    measure13: nil,
                    measure14: nil,
                    measure15: nil,
                    measure16: nil,
                    measure17: nil,
                    measure18: nil,
                    measure19: nil,
                    measure20: nil)
    }
    
    override func tearDown() {
        super.tearDown()
    }
    
    func testAddToFavorites() throws {
        XCTAssertEqual(favorite.addedItems.count, 0)
        favorite.add(addedItem: meal)
        XCTAssertEqual(favorite.addedItems.count, 1)
    }
    
    func testUndoFavorites() throws {
        favorite.add(addedItem: meal)
        XCTAssertEqual(favorite.addedItems.count, 1)
        favorite.undo(addedItem: meal)
        XCTAssertNotEqual(favorite.addedItems.count, 1)
    }
}
