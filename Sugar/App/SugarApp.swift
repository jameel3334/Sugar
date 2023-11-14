//
//  SugarApp.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
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
