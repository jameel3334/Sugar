//
//  InstructionsView.swift
//  Sugar
//
//  Created by Mohammed Jameeluddin on 6/13/24.
//

import SwiftUI

struct InstructionsView: View {
    let text: String
    var body: some View {
        HeaderTextView(text: Constants.String.instructionViewTitle,
                       multiTextAlignment: .leading,
                       color: Color(Constants.Color.textColor))
        BodyTextView(text: text,
                     multiTextAlignment: .leading)
    }
}

struct InstructionsView_Previews: PreviewProvider {
    static var previews: some View {
        InstructionsView(text: "Heat oven to 190C/170C fan/gas 5. Tip the flour and sugar into a large bowl. Add the butter, then rub into the flour using your fingertips to make a light breadcrumb texture. Do not overwork it or the crumble will become heavy. Sprinkle the mixture evenly over a baking sheet and bake for 15 mins or until lightly coloured.\r\nMeanwhile, for the compote, peel, core and cut the apples into 2cm dice. Put the butter and sugar in a medium saucepan and melt together over a medium heat. Cook for 3 mins until the mixture turns to a light caramel. Stir in the apples and cook for 3 mins. Add the blackberries and cinnamon, and cook for 3 mins more. Cover, remove from the heat, then leave for 2-3 mins to continue cooking in the warmth of the pan.\r\nTo serve, spoon the warm fruit into an ovenproof gratin dish, top with the crumble mix, then reheat in the oven for 5-10 mins. Serve with vanilla ice cream.")
    }
}
