//
//  DessertsListView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct DessertsListView: View {
    
    @StateObject var viewModel = DessertsViewModel()
    @State var showAlert = false
    
    var body: some View {
        NavigationView {
            List (viewModel.desserts.sorted(by: { $0.title < $1.title })) { dessert in
                NavigationLink(destination: DetailedItemView(id: dessert.id),
                               label:  {
                    ListRowView(imageURL: dessert.image,
                                title: dessert.title)
                })
                .listRowSeparator(.hidden)
            }
            .listStyle(.grouped)
            .navigationBarTitle(Constants.String.dessertsTitle)
            .navigationBarTitleDisplayMode(.automatic)
        }
        .task {
            do {
                try await viewModel.fetchDessertData()
            } catch {
                showAlert = true
            }}
        .alert(isPresented: $showAlert) {
            Alert(
                title: Text(Constants.String.alertTitle),
                message: Text(Constants.String.alertMessage),
                dismissButton: .default(Text("OK"))
            )
        }
    }
}

struct DessertsView_Preview: PreviewProvider {
    static var previews: some View {
        DessertsListView()
    }
}



