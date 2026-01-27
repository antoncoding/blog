---
title: "Premia Contract Review"
date: 2022-04-13
tags: ["solidity", "evm", "english"]
status: "Public"
type: "Post"
---

# Premia Contract Review

#### How come I’m writing this…

As a contract developer in DeFi, I know how difficult it is to catch up with all the new projects that come up every few days. Sometimes I have a hard time balancing my time spent on learning new “mechanisms” and learning new “engineering skills”. It satisfies me the most when I can achieve both at the same time, but it’s very time-consuming.

I’m writing this post simply to share some notes I made while going through **Premia’s** code base. I wish to write more articles like this in the future if it can help people learn something in a relatively efficient way. At the end of the day, we all benefit the most by growing together as a community and take over CeFi’s big pie.

On the one hand, I want to use this as a forcing function for myself to dive deeper into different projects and learn new tricks from each team. On the other hand, I want to find other people that are willing to share their learnings in similar ways. Please feel free to contact me if you're interested in collaborating in writing (or just help me review) these articles 🥳.

In this post, I will first go through a high-level introduction of the system, then focus on my notes of some engineering decisions, including new tricks I learned, and things I think they can improve, both architecture-wise and implementation-wise.


### Agenda:

- **Introduction**: high level introduction of Premia
- **Wow**: things that “wow”ed me. Including new solidity skill, new trick, great architecture or just good code.
- **Issues**: Things I found weird in the code base, could be bugs, code with unclear purpose.
- **Optimization opportunities:** mostly gas optimizations that can be done
- Final thoughts: random comments on the code, protocol and the team

### **Introduction of** Premia:

Compared to other AMM like **Lyra**, which is trying to build a standard “neutral” market maker that provide liquidity for both buy and sell sides, Premia is not designed to be a market neutral, instead, the liquidity providers (LP) are really “option sellers” which have decided their market view while adding liquidity.

Liquidity providers can decide if they want to sell “call” or a “put”, and deposit underlying asset (ETH) or base asset (USDC) accordingly into the pool. Even though both call sellers and put sellers' deposits into the same pool contract, the internal accounting is totally separated. Once you provide liquidity, your money will be pulled into the system and sitting at the end of a “queue”, waiting for buyers to come.

When a buyer come and request a quote, the system takes into account 3 main factors and responds a quote:

- A ML model driven vol surface is being provided on-chain though Chainlink, which will be used to get a precise vol value used to calculate a base price with Black-Scholes.
- A fully on-chain **c-level** value indicates the current supply and demand in the pool
- A slippage coefficient which charges an additional fee based on remaining liquidity.
If the buyer takes the quote, the system will **loop through the seller queue** until there’s enough liquidity to **fully collateralized** the amount of contracts, and mint “long tokens” and “short tokens” to the buyer and seller(s) respectively.

After each trade and adding or removing liquidity, the **C level** will change, indicating the system is quoting “above the base price” or “below the base price”. Buying indicates more demand, which will drive the c-level up, while deposits indicate more supply, which will make it lower.

Instead of thinking of AMM, I think it’s more intuitive to think of Premia like an huge auto-matching marketplace, where “sellers” commit capital first and will be exposed to a lot more risk because of all the uncertainties. But eventually, the c-level should successfully capture the market demand and offer a price good enough to attract sellers.


### Wow:

Things I learned from Premia that’s worth some applause.


#### Diamond standard (**EIP-2535)** 💎

Diamond standard is an EIP that proposes a new way to build upgradable contracts. With a built-in mapping between function selector and implementation contract, the proxy can use **delegateCall** to a different implementation contract (called **facet*** *in this EIP) based on what the function is. This makes the proxy highly flexible, and also able to handle more than 24KB bytes of implementation code. The downside is that calls will be slightly more expensive because it will need 1 more SLOAD for every call.

Premia is the first project I saw that adopted the standard. Just in case you didn’t know, **Premia team also built an open-sourced **[SolidState](https://github.com/solidstate-network/solidstate-solidity)** library** which re-write lots of useful libraries Diamond-styled, including most popular token standards like ERC20, ERC721, ERC1155. You should check it out if you’re considering making your next project a gem.

Premia has officially talked about advantages of diamond standard in their[ blog post](https://blog.premia.finance/we-like-the-eip-2535-diamonds-90184b2e6741), including why they chose it. From what I saw, the primary reason is because of the contract size limit: The core “Pool” logic is very complicated and wouldn’t have been able to fit into 1 single 24 KB contract. By adopting the standard, you write all the logic like it’s a single contract, and worry less about how to separate 1 big contract into several contracts or external libraries, which introduce more problems like access control, approvals.. etc.


#### **Cleaner storage for upgradable contract**

Diamond standard is also good for “**storage control**”. Instead of inheriting a shared “Storage contract”, each diamond logic contract (facet) only needs to inherit its own “Storage contract”, and there will be no collision because each storage contract starts storing its variable from different slots.

In Premia, the storage separation for different facets is not utilized a lot, for example, most of the facets (PoolExercise, PoolSettings, PoolSwap) that build up the core pool just inherit the same storage library (PoolStorage). But this is partially because of all pool facts share lots of the same variables, and it will be messier if you try to split them up into multiple storages.

That being said, you can still find some “advantage” of diamond storage patterns in the code base. For example, each Proxy will be linked to be a Pool and also an ERC1155 token, and because of the nature of storage separation, in each contract you don’t have to worry about storage collision (or declare bunch of `address[20] __gap` ). In the future if you can also add more storage to any facet.

After reading Premia’s contracts, (and knowing that there is an existing library). I would definitely consider my next project being built with diamonds. That way I can worry less about contract size and unnecessary contract separation, and will be able to focus more on facet and storage separations to increase readability.

Better readability, better security ;).


#### Batched deposit to avoid C-level manipulation

When a user deposits liquidity into the pool, the deposit will first be added into a “**batch**”, and then be processed together every 20 blocks and change the c-level. Most of the state changing functions (including `purchase`, `reassign`, `withdraw`, …etc) will call an internal function _update first, which will process the pending deposits if there’s any in the batch.

This is not for gas optimisation purpose, but to prevent people to use multiple deposits to mess up the “c-level”, because of nature of a “**path dependence**” of the c level update formula, many small deposits will affect c level more and make it lower than a single big deposit:


![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F1a6b383f-bfd8-4a81-a962-927b6e47fc6b_532x462.png)

This is a very important mechanism, my personal take is, all the protocols that use “path-dependent” update formula on any state variable **should learn from this approach** to reduce the attack surface.

Note that even though the impact from `deposit` is batched, `purchase` and `withdrawal` function will still affect the c-level instantly. I think this is reasonable, because the mechanism is primarily designed to “protect” the LP, we have to prevent someone from trying to drive c-level down. (If c-level is low, options will be under-priced). On the flip side, purchase and withdrawal are functions that will **increase** **c-level**, and there’s no way to directly game the system when the c-level is high, as you cannot force a “sell” to happen.

(I also thought this was a mistake initially, but turn out this is a good decision to avoid unnecessary complexity)


#### Use of “bit sequence” to reduce SLOAD in loop

Whenever the Pool contract is touched, price of the underlying asset will be fetched from Chainlink Oracle and stored in the contract with [setPriceUpdate](https://github.com/Premian-Labs/premia-contracts/blob/e2f7a601ae5b5e34fa7a0f3df983fc5e12d41de5/contracts/pool/PoolStorage.sol#L490). When a user wants to exercise an expired option, the system finds the first entry after the expiry timestamp, and use it as the settlement price.

Loop sounds bad, but there are some nice tricks to handle the “loop”.

First, new price updates within the same hour are batched, that is why you see the following code in the `setPriceUpdate` function.


```Plain Text
uint256 bucket = timestamp / (1 hours);
l.bucketPrices64x64[bucket] = price64x64;
```

This is easy to understand: it’s too inefficient to loop through every single seconds and find the closest timestamp with a price update, so it make sense to merge these data and only have one price per hour. With this “batching”, now it seems a lot more reasonable to loop through all the “hours” after expiry, and find the first hour as the settlement price: Just loop through all the `buckets` until you find the non-zero number in `bucketPrices64x64` mapping.

But if you consider a bad scenario, this can be very gas consuming as well: If the system somehow does not get called for 10 hours, you will need to read 10 more storage slots to find that price (and `SLOAD` is expensive).

What Premia did here is, for every 256 hours, use a single uint256 variable, **(256 bits of 0 and 1)** to indicate which hours of these 256 hours have updates. They call this a “**sequence**”. So every 256 hours, it creates a new sequ**ence**. To give an example, If the sequence is `1000000…00`, this would mean that there is a price update in the first hour of the 256 hours in this sequence; if the sequence is `1110000…00`, it means the first 3 hours all have updates. This is how easy to update this “sequence” in the same `setPriceUpdate` function:


```Plain Text
l.priceUpdateSequences[bucket >> 8] += 1 << (255 - (bucket & 255));
```

Obviously, this will reduce the amount of `SLOAD`: with this “bit map”, you only needs to load 1 variable (sequence), and loop through the bits to find the first entry after the expiry, (the code is here in [getPriceUpdateAfter](https://github.com/Premian-Labs/premia-contracts/blob/e2f7a601ae5b5e34fa7a0f3df983fc5e12d41de5/contracts/pool/PoolStorage.sol#L520)), then use another `SLOAD` to query the target batch (in some cases, you might need to load 2 sequences when the timestamp is close to the end of the first sequence), but still that’s a lot better than querying the price map directly one by one. By using this trick, it’s almost certain to get a price with just 3 `SLOAD`, (unless the contract is not called in 256 hours), which is pretty decent.

Even though the bit operation seems scary at first glance, after spending some time digesting it, I found it very elegant. From now on, I’ll not do loop without a fancy “sequence”.


#### Use of EIP1155 to manage and tokenize everything

There are several kinds of “tokens” in the accounting system, including “free liquidity token”, “reserved liquidity token”, “long token” and “short token”. The upside is that it makes it very easy to manage token balances by using similar `_mint` and `_burn` functions, with different tokenId (the tokenId calculation is also pretty[ optimized](https://github.com/Premian-Labs/premia-contracts/blob/e2f7a601ae5b5e34fa7a0f3df983fc5e12d41de5/contracts/pool/PoolStorage.sol#L125)).

But, making liquidity token transferable is not easy with Premia’s design, because all sellers are being tracked by an “underwriter queue” in order. If people can freely “transfer liquidity tokens”, that will mess up the queue. That’s why the `_beforeTokenTransfer` hook got very complicated because whenever a liquidity token is transferred, new recipient should be added to the queue, and if the sender no longer has liquidity, he or she should be removed from the queue.

I’d be curious to see how many people actually use the feature of free liquidity token transferring, to consider if this is a good design or over engineering. I do think the mentality is good, it makes things a lot more composable, which is highly appreciated in the DeFi lego world.


#### Constraint on malicious purchase

Even with the fancy vol surface and slippage coefficient, it’s still very likely that malicious attackers can use some parameters to maliciously buy lots of options with relatively low price, and “lock up” a LP’s fund. When I first thought of this, I went directly to their quoter contract and successfully got a quote for a call that expires in 5 years, with a strike price of 300,000. But again, Premia team is one step ahead. There’s a 90 days constraint on maturity and similar limitations on strike price in the [_verifyAndPurchase](https://github.com/Premian-Labs/premia-contracts/blob/e3c4fe2be8c5708e954510a133f5dac634669414/contracts/pool/PoolWrite.sol#L259) function, just to make sure bad actors cannot lock up LP’s funds.

I like the way they let the view function return the quote but put the actual constraint on the state-changing function. Even if this seems trivial, lots of teams do like to put reverts in view functions which I think can be very annoying. I think the design here, intentionally or not, gives better UX while integrating with the contract.

Final comment: if I were writing the contract, I’d put the strike and maturity constraint as state variables and govern them, because these types of variables are the easiest to be “governed by the community” and would probably need more tests in prod, it will make the initial parameter choice less stressful while launching a protocol.


---


### Issues:

As I went through the contract, there are things that I found weird first, eventually after discussing with the team, some of them turned out to be a cool feature (which is in the section above), some of them turned out to be small mistakes. Here are the 1 mistakes and 1 small issue I found, fortunately none of them are real vulnerabilities.


#### **[Typo] - Inconsistent slippage coefficient calculation between whitepaper and implementation.**

**It’s just a typo on the whitepaper, and it’s now corrected and re-published.**

When I was reading the formula to [quote the price](https://github.com/Premian-Labs/premia-contracts/blob/master/contracts/libraries/OptionMath.sol#L79), I found that there’s an inconsistent between the whitepaper and the implementation on the “slippage coefficient”, which is a parameter used to tune the quote depending on how much liquidity will be used in a trade. According to the whitepaper, the slippage coefficient **was**:


![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fde1dbc5c-e2e6-4e60-b2fd-27b27c56f3c5_410x230.png)

But in the [quotePrice](https://mysoliditynotes.substack.com/p/OptionMath.sol#79) function, it’s calculated as:


![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F9f34bc12-7c4f-4615-820a-8eb0896f743f_508x184.png)

Which is one-negative-sign different.

I looked at the whitepaper and the code back and forth for like an hour, and I was 99% sure it was a bug. But then I try to draw the formula and it turned out that it’s just the whitepaper missing a negative sign 🤣.. As we can see below, the correct formula indeed is the one implemented, as it produces the correct line (monotonically decreasing) between x and g(x).


![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fee08dc81-4b57-4b12-815e-ac6a7bd2a22c_1498x778.png)

The formula on the whitepaper, on the other hand, give us this graph (which is wrong):


![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fb4fde635-a132-4a82-a2e6-ece509b850bd_1434x760.png)

But forget about the typo, you can see how the formula is actually well designed so there are lots of parameters that can be re-used during c-level update and slippage coefficient calculation. Saving gas is very important!

After I found the issue, I contact the team and their research team confirmed and corrected the error when in a few hours.


#### Zero-Risk Farming:

Theoretically, it’s possible that someone can deposit, wait until his capital is about to be used, and buy an option from the system and become his own “counter-party”. By doing this, he or she can earn the PREMIA token reward without actually exposing to any risk.

This is not a bug for the core system, but more like a way to game the reward program. It’s almost impossible to prevent this in a “queue based” structure, even if we add some randomness, an attacker can still write smart contracts that enforce his buy transaction to use the “target liquidity” otherwise just revert.

I believe this is a hard question to solve given Premia’s native design of long-shot pairing, in web3, you can’t restrict 1 random address from trading with another one. But, in a robust system, attackers who intended to game the program this way will be forced to take some risks: If another buyer comes before he does, he will be forced to commit his capital on other trades (and be like a real seller).


---


### Optimization Opportunity:


#### 1. More storage optimizations:

Ever since I read about how “[Ribbon optimizes their storage cost with structs](https://github.com/ribbon-finance/ribbon-v2/blob/0a95538aa811ff392bedaaaa3c41a1b2ecd913be/contracts/libraries/Vault.sol#L48)”, I started to pay extra attention to all the number types that can be packed together into a single storage slot. Even though casting them will cost gas, it’s usually worth it if you can save just one `SSTORE`.

Another thing that shouldn’t be compromised is **readability**, we don’t want to put variables that’s not related to each other together just to pack them in the same storage. So the ideal candidates are those who live in the same struct: These variables are usually related and get read from and written to in the same function.

I found that there are a few places that can benefit from this optimization, two easy examples are `PoolInfo` and `UserInfo` structs in the `PremiaMiningStorage` contract. Some quick gas test i ran to see how much gas can we save:

Before packing: (3 columns with numbers: low, high, average)


![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F4fefd44f-8316-4b38-958b-519bd7814f83_2502x772.png)

After packing:

- [PoolInfo.allocPoint](https://mysoliditynotes.substack.com/p/PoolInfo.allocPoint) => uint128 , [PoolInfo.accPremiaPerShare](https://mysoliditynotes.substack.com/p/PoolInfo.accPremiaPerShare) => uint128.
- `UserInfo.reward` => uint128 , `UserInfo.rewardDebt` => uint128

![](https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fd2c7591e-69b5-4a1b-b86d-2c06ba678e1d_2488x738.png)

You can see a saving of around 10K gas on average on deposit and withdraw functions, which is around $3 when ETH is $3000 with gas price of 100 gwei. Not bad given it’s a simple type change.

Another example is the two variables in `PoolStorage`: `cLevelBaseUpdatedAt` and `cLevelBase64x64` , should be packed together, because there’s no reason to use uint256 for a timestamp, and these 2 variables are always updated together. (also cLevelUnderlyingUpdatedAt and cLevelUnderlying64x64 )

If we utilized this trick more, quite some gas can be saved with very little change engineering-wise. Unfortunately this optimization cannot be added easily once the contract is deployed, because it will mess up the existing storage slots.


---


### **Final thoughts**


#### The code

The code is not perfect in terms of documentation and styling, some functions are lacking NatSpec, or using some hard-coded “magic numbers”. But overall, it’s quite easy to understand and follow the main logic.

I also wish there were more comments around variables like priceUpdateSequences, or around rationale behind deposit batching… etc, so it’s easier for newcomers to understand “why” and follow the logic.


#### The team:

Huge respect to the engineering team which built the SolidState library from scratch. While I was going through the library code base I made some small optimization and made a PR to the library, the engineering team was very responsive to give me feedback and the PR got merged within 1 day. Maintaining an open source library is not easy, not to mention responding with good efficiency while you have other things on your plate, I really respect a team with such an open source spirit.

Other than that, the team has been super helpful and responded all my annoying engineering and finance questions while I’m going through the code base. I enjoy the time chatting and discussing with them.


#### The Protocol

I do feel like as a newbie option user, it seems to me that the risk of being a seller in Premia is still too high. I think the protocol can enable a lot more use cases if sellers can have more control on how their capital will be used.

With the existing code base, one “feature” I came up with is to let sellers post an **order** struct and let the protocol also be able to serve like an on-chain order-book. For example, let the sellers directly post “range of strike” they’re willing to sell, or use **premium** as constraint in the order. This will help a lot because more automatic strategies can then specify “what kind of call or put” do they want to sell.

I can understanding the choice right now because adding constraints will make the queue and auto seller selection problematic, so I think it’s more realistic to just use an order mapping, and let the buyers query these data off-chain and specify the orders to fill when they want to trade). Given that most buyers are retails, this would open up a lot more integration opportunities, and Premia can continue to work on optimizing UX for “retail option buyers” to buy options from different kind of underwriters.


---

That’s it for today! Special shout-out to [@Lumyo](https://twitter.com/LumyoDev?t=pTDl61zpRvrnE9Ujcue2Bw&s=09) and [@Karlis](https://twitter.com/PandaJacketGuy?t=CQldlXSejFgYxbSerKhdqA&s=09) from Premia, and the security expert @[Martinet](https://twitter.com/martinetlee?t=2C-qFZDECfma-g5jT3fxUw&s=09) for reviewing this post. If you like this, please subscribe or share with other people that might find it useful. See you next time ;)
