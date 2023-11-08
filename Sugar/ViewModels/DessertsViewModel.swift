//
//  DessertsViewModel.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

class DessertsViewModel: ObservableObject {
    
    @Published var desserts: [Dessert] = []
    
    func fetchDessertData() async throws {
        let url = Constants.Url.dessertsURL
        do {
            let data = try await NetworkManager.shared.service.fetchData(using: url, for: Desserts.self)
            Task { @MainActor in
                self.desserts = data.desserts
            }
        } catch {
            throw APIError.invalidData
        }
    }
}
