//
//  FavoriteViewModel.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

class FavoriteViewModel: ObservableObject {
    @Published var addedItems = [Meal]()
    
    func add(addedItem: Meal) {
        if !addedItems.contains(addedItem) {
            addedItems.append(addedItem)
            return
        }
    }
    
    func remove(at offsets: IndexSet) {
        addedItems.remove(atOffsets: offsets)
    }
    
    func undo(addedItem: Meal) {
        if let index = addedItems.firstIndex(where: { $0.id == addedItem.id}) {
            addedItems.remove(at: index)
        }
    }
}
