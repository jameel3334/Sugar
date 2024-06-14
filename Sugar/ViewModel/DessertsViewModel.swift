//
//  DessertsViewModel.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import UIKit

class DessertsViewModel: ObservableObject {
    @Published var desserts: [Dessert] = []
        
    func fetchDesserts() async throws {
        guard let url = URL(string: Constants.Url.dessertsURL) else {
            throw APIError.invalidURL
        }
        do {
            let data = try await APIService.shared.fetchData(using: url, for: Desserts.self.self)
            for dessert in data.desserts {
                if !desserts.contains(dessert) {
                    Task { @MainActor in
                        desserts.append(dessert)
                    }
                }
            }
        } catch {
            throw APIError.invalidData
        }
    }
}

