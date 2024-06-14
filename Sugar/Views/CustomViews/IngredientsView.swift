//
//  IngredientsView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import SwiftUI

struct IngredientsView: View {
    let text: [String]
    var body: some View {
        VStack(spacing: 10){
            HeaderTextView(text: Constants.String.ingredientsViewTitle,
                           multiTextAlignment: .leading,
                           color: Color(Constants.Color.textColor))
            Divider()
            ForEach(text, id: \.self) { item in
                BodyTextView(text: item, multiTextAlignment: .center)
            }
        }
    }
}

struct IngredientsView_Preview: PreviewProvider {
    static var previews: some View {
        IngredientsView(text: [
            "Eggs - 2",
            "Oil - 1 Cup",
            "Pepper - 1/2 tsp",
            "Salt - 1/2 tsp"
        ])
    }
}
