//
//  ListRowView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 11/7/23.
//

import SwiftUI

struct ListRowView: View {
    
    var imageURL: String
    var title: String
    
    var body: some View {
        HeaderTextView(text: title,
                       multiTextAlignment: .leading,
                       color: .white)
            .shadow(color: .black, radius: 1)
            .minimumScaleFactor(0.7)
            .padding(EdgeInsets(top: 35, leading: 10, bottom: 35, trailing: 0))
            .offset(y: 20)
            .background(
                ImageView(imageURL: imageURL)
                    .opacity(0.5)
                    .scaledToFill()
            )
            .background(
                Color.gray
            )
            .mask(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
            )
    }
}

struct RowComponentView_Preview: PreviewProvider {
    static var previews: some View {
        ListRowView(imageURL: "https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg",
                         title: "Apple")
    }
}

