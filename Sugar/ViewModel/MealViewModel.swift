//
//  MealViewModel.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import UIKit

class MealViewModel: ObservableObject {
    @Published var fetchedMeal: Meal?
    
    func fetchMeals(using id: String) async throws {
        guard let url = URL(string: Constants.Url.mealBaseURL + id) else {
            throw APIError.invalidURL
        }
        do {
            let data = try await APIService.shared.fetchData(using: url, for: Meals.self)
            guard let meal = data.meals.first else {
                throw APIError.invalidData
            }
            Task { @MainActor in
                fetchedMeal = meal
            }
        } catch {
            throw APIError.invalidData
        }
    }
}

