//
//  DessertsViewModel.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

class DessertsViewModel: ObservableObject {
    
    @Published var desserts: [Dessert] = []
    
    let networkManager: APIServiceProtocol
       
    init(networkManager: APIServiceProtocol = APIService()) {
        self.networkManager = networkManager
    }
    
    func fetchDessertData() async throws {
        guard let url = URL(string: Constants.Url.dessertsURL) else {
            throw APIError.invalidURL
        }
        do {
            let data = try await networkManager.fetchData(using: url, for: Desserts.self)
            Task { @MainActor in
                self.desserts = data.desserts
            }
        } catch {
            throw APIError.invalidData
        }
    }
}
