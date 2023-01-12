# ERC-20 & NFT Indexer

Taken from skeleton app that uses the Alchemy SDK rigged to Alchemy's Enhanced APIs in order to display all of an address's ERC-20 token balances and owned NFTs

## Set Up

1. Install dependencies by running `npm install`
2. Start application by running `npm run dev`

## Feature list (with progress colours)


1.  🟢 Add Wallet integration so that any user that connects their wallet can check their ERC-20 token balance
2.  🟢 There is no indication of a request in progress... that's bad UX! Do you think you can add some sort of indication of loading?
3.  🟢 The token balances can sometimes be a little long and break the outline of the page... can you fix that? 🔧
4.  🟢 There is no error-checking for wrongly formed requests, or really any error checking of any kind... can you add some in?
5.  🟢 Can you add ENS support for inputs?
6.  🟡 Make it prettier! 🎨
    6.1 🟢 New layout
    6.2 🟢 The images and grid display could look better... anything you can do about that?
    6.4 🟢 Use React Routing for wallet address to make it bookmark friendly
    6.3 🔴 Last touches
7.  🟡 There are ways to make this app faster... can you implement some of them? How can the query be made _even_ quicker?
    7.1 🟢 Add SWR and useHooks
    7.2 🔴 Add SSR or an API to make it better (hide Alchemy api key too)
8.  🟡 Add NFT List with available information from Alchemy API
9.  🔴 Completely open-ended!! Use this as the base for your next hackathon project, dream company or personal expedition :)
    9.1 🔴 Add Ethereum price and balance to de left
    9.2 🔴 Add Ethereum as first token
    9.3 🔴 Add price to tokens to calculate total balance
    9.5 🔴 Add list of last transactions
    9.6 🔴 Add polygon connection (others?) and Let user select chain
        9.6.1 🔴 Show tokens from different chains at the same time
        9.6.2 🔴 Show NFTs from different chains at the same time
