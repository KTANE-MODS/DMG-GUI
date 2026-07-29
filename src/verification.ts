// Todo for deletion of module entry, bomb, or pool, have verification
// todo add import for dmg

// Verification (if not right, will throw error)
// todo verify mission name trimmed is not blank

// todo verify mission description trimmed is not blank

// todo for each bomb,
    // todo Bomb Time is max 6 days
    // todo strikes is at least 1
    // todo Widgets is at least 0
    // todo needy activation time is at least 0
    // todo for each Pool
        // todo if type is "preset"
            // todo preset is "profile" or "needy profile", verify json input is not empty
        // todo if type is "pool"
            // todo for each module entry
                // todo verify module name is not empty
                // todo verify percentage is between 0 - 100. Only taking integers for now
            // todo verify percentage sums to 100
        // todo if type is "Module Name"
            // todo verify module name is not empty