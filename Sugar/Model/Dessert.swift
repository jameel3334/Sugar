//
//  Dessert.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import Foundation

struct Desserts: Codable {
    let desserts: [Dessert]
    
    enum CodingKeys: String, CodingKey {
        case desserts = "meals"
    }
}

struct Dessert: Codable, Identifiable, Equatable {
    let title: String
    let image: String
    let id: String
    
    enum CodingKeys: String, CodingKey {
        case title = "strMeal"
        case image = "strMealThumb"
        case id    = "idMeal"
    }
}

extension Desserts: Equatable {
    static func ==(lhs: Desserts, rhs: Desserts) -> Bool {
        lhs.desserts == rhs.desserts
    }
}
