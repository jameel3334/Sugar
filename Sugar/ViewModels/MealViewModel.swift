//
//  MealViewModel.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

class MealViewModel: ObservableObject {
    
    @Published var fetchedMeal: Meal?
    let baseURL = Constants.Url.mealBaseURL
    
    func fetchMealsData(using id: String) async throws {
        let url = "\(baseURL)\(id)"
        do {
            let data =  try await NetworkManager.shared.service.fetchData(using: url, for: Meals.self)
                guard let meal = data.meals.first else {
                    throw APIError.invalidResponse
                }
            Task { @MainActor in
                fetchedMeal = meal
            }
        } catch {
            throw APIError.invalidData
        }
    }
}
