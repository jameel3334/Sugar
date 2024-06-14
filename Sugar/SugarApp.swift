//
//  SugarApp.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import SwiftUI

@main
struct SugarApp: App {
    @StateObject var viewModelFavourite = FavoriteViewModel()
    var body: some Scene {
        WindowGroup {
            LaunchView()
                .environmentObject(viewModelFavourite)
        }
    }
}
