---
title: "Why Trustless Designs Make DeFi Truely Low-Risk"
date: 2025-09-23
tags: ["english", "defi", "ethereum"]
status: "Public"
type: "Post"
---

# Why Trustless Designs Make DeFi Truely Low-Risk

## **Why Trustless Design Makes DeFi Truly Low-Risk**

> Why boring and inefficient protocols are underrated and Ethereum-aligned.

*Special thanks to *[Danger](https://x.com/safetyth1rd)*, *[Simon](https://x.com/Crotts__)*, *[Indigo](https://x.com/_ndigo)*and *[Chih Chen Liang](https://x.com/ChihChengLiang)* for feedback and review. This post is also published on *[Paragraph](https://paragraph.com/@emodev/why-trustless-designs-make-defi-truely-low-risk)

Vitalik recently published an article titled [Low-Risk DeFi Can Be for Ethereum What Search Was for Google](https://vitalik.eth.limo/general/2025/09/21/low_risk_defi.html). It's encouraging to see him acknowledging the "DeFi teams" who have focused on building this space for years.

While I agree with Vitalik's vision, I believe we can strengthen the framework by focusing on trustlessness as the key indicator of genuine low-risk DeFi. If history tells us anything, it won't be long before every team starts branding themselves as "low-risk DeFi" just to ride the narrative.

I'll argue in this post that trustless protocols are naturally low-risk (and low-yield), regardless of product type, and that pursuing trustlessness provides a more objective measure than classifying by use cases. We won't sacrifice anything meaningful in the end, and these protocols have huge long-term potential for the ecosystem.


![](https://img.paragraph.com/cdn-cgi/image/format=auto,width=3840,quality=85/https://storage.googleapis.com/papyrus_images/d05c9897e054eb8a09c6f9d9ff1973c7f7b8dd54ee98803e2174fbeb4501f621.png)

Here are the key points I'll explore:

1. The Standard for Trustless Design
1. Why Trustless DeFi is Inherently Ethereum-Aligned
1. Why Trustless DeFi Equals Low Risk DeFi
1. Why should protocols be Trustless

---


### **The Standard for Trustless Design**

In my opinion, a truly trustless DeFi protocol could be defined easily with just one rule: no privileged roles within the protocol. No admin, pauser, executor, rebalancer, or any other special access.[1] This also means protocols should be immutable - no upgrades that could change how my assets are managed.[2]

It should exemplify a [hyperstructure](https://jacob.energy/hyperstructures.html), as Jacob describes it. While there may be a "fee switch" to create value for the team and token holders, there should be no privileged players who can manipulate the rules, and it should be fair to all participants.

This doesn't mean every DeFi interaction must meet these standards. But I believe the **core infrastructure** should, because that's what enables everything else to build on top safely.


### **Why Trustless DeFi is Inherently Ethereum-Aligned**

You might be wondering why a protocol needs to be "trustless". Why does it matter?

The reason is that by creating a trustless protocol for straightforward agreements between parties, **we are fundamentally changing finance**.

Before blockchain, storing value without trust meant hiding cash under your mattress. But idle cash loses to inflation and misses growth opportunities. Any financial agreement - deposits, trades, contracts - **required trusting a third party to manage it**.

DeFi changes this. For the first time, terms like 'trade', 'finance' and 'contract' don't require a trusted middleman taking fees and adding attacking surface.

This is why I see trustless protocols as the true hallmark of DeFi. They're what make the space special, and they also happen to overlap closely with what Vitalik calls "low-risk DeFi."


![No it's not](https://img.paragraph.com/cdn-cgi/image/format=auto,width=3840,quality=85/https://storage.googleapis.com/papyrus_images/e137cc448cfd41997d9d38d8b567c11f4c5f492b5b23fed70e9992a2e2dec6de.png)

**This innovation aligns uniquely with Ethereum.** Ethereum embodies trustlessness, featuring no centralized control over its protocol and a commitment to credible neutrality. Trustless DeFi protocols reflect these same principles, serving as neutral bases for various financial products. Through Ethereum, we can establish censorship-resistant solutions that allow anyone to **finance** their portfolio without relying on trust assumptions.


### **3. Why Trustless DeFi Equals Low Risk DeFi**

When Vitalik talks about "low-risk DeFi," it's easy to start categorizing by application: lending = safer, derivatives = riskier. But in my view, the better way to identify low-risk protocols is by how trustless they are. **The most trustless protocols are naturally low-risk, because they accept inefficiency in exchange for resilience.**


#### **Inefficiency Shows Up Everywhere**

**Ethereum's execution environment creates natural inefficiency**. With 12-second block times and MEV, even simple trades become inefficient. A DEX order might fail due to front-running or network congestion, forcing users to accept wider slippage buffers just to execute reliably.

But the more important inefficiency (and the best lens for understanding protocol risk) is **capital efficiency**.


#### **Capital Efficiency**

**Capital efficiency** is about how effectively a protocol uses idle assets. This is where you see the clearest trade-off between safety and yield. The same underlying function—lending, trading, derivatives—can have vastly different risk profiles depending on how efficiently the protocol uses capital.

**Lending Protocols**

Lending protocols essentially choose between two design philosophies: isolated lending markets vs monolithic markets. [Morpho](https://morpho.org/) has become the gold standard for the isolated approach.

In Morpho's design, borrowers lock collateral in the contract, and it just sits there until repayment. That collateral doesn't generate extra yield—it's only there to back the loan. The benefit is clear: liquidations always work, and lenders' risk profiles stay static and predictable.

By contrast, most lending protocols allows rehypothecation in a monolithic market setting, lending out collateral for extra interest. This increases capital efficiency, but now collateral might not always be available, and lenders must trust additional assets to back their loans. What started as a "low risk" lending scenario suddenly carries compounded risks.

**Options Protocols**

Option protocols show the same dynamic. Our first impression of options is usually about efficiency and extremely "high-risk, high-reward". But this is not always true.

Here's how a less efficient implementation (Pods Finance first pioneered this kind of **physically-settled option** in 2019[3]): to sell one call option on ETH, you lock the full ETH upfront. Want to sell an ETH call for a $50 premium? Lock 1 ETH which is worth $4000+ today.

It's extremely inefficient, but it's bulletproof because it has **zero trust dependencies**: the buyer himself can choose when to exercise this right, and fill the trade against the locked asset. This is even **more trustless than CDP stablecoins and all lending protocols**, which all have orale dependencies.

P.S., To this day I still believe this would have been the best venue for Ethereum Foundation to earn yield on their treasury ETH. 💰💰


#### **The Pattern**

The pattern is clear: trustless protocols lock up more assets and make conservative assumptions. More "efficient" protocols add dependencies—oracles, managers, complex risk models. Each dependency boosts yield but adds failure points. And risks stack quickly.

This is why I don't think "low-risk DeFi" should be defined by application type, but by design philosophy:

> Low-risk DeFi isn’t about the application type. It’s about simple contracts with minimal dependencies and low trust assumptions. They yield less, but they survive longer.


#### **Stupid and Boring Protocols**

Another big shared property between Morpho and Pods is their simplicity. You can learn both contracts in under 30 minutes. They’re simple and intentionally straightforward . Even I could understand Pods when I first read about it in 2020 with no financial knowledge and very limited solidity skills (see [Morpho](https://github.com/morpho-org/morpho-blue/blob/main/src/Morpho.sol) and [Pods](https://github.com/pods-finance/ohmydai-contracts/blob/develop/contracts/Option.sol)'s code here).

This doesn't imply we shouldn't promote new features for greater efficiency and usability; I just simply believe that "inefficiency" is almost always underrated.

As my friend Mihai put it, [Make DeFi boring again](https://x.com/mihai673/status/1969875847021474259)[.](https://x.com/mihai673/status/1969875847021474259) It turns out that the simplicity or "boring" nature of contracts can be a reliable indicator of lower risk.


### **4. Why Should Protocols be Trustless**

Why should protocols move away from chasing “efficiency” and focus on products that may seem “inefficient”? Honestly, it’s not an easy sell. Most teams are driven by PMF and revenue pressure, so they chase higher yields, more features, and VC attention. This feedback loop favors “efficient” designs, while protocols built on trustlessness, self-custody, and financial freedom often get overlooked.

That’s why Morpho’s growth over the past two years has been so inspiring (to me). With minimal trust assumptions, their “boring infrastructure” has become incredibly valuable because it plugs into almost everything—restaking, RWAs, stablecoins. Their success proves that inefficiency is a feature, not a bug. Hopefully it’s not just “cool,” but also proof that boring, trustless design is what creates something groundbreaking long term.

When I think about the "trustless" protocols, I now imagine a graph in my head that shows two very different trust schemes.


#### **The Old Stack of Trust**


![In the “old” DeFi trust scheme, each layer adds its own assumptions. Risk piles up and often the "DeFi Protocol" itself becomes the single point where all those assumptions converge. This leaves less room for 'trust' to be used.](https://img.paragraph.com/cdn-cgi/image/format=auto,width=3840,quality=85/https://storage.googleapis.com/papyrus_images/6c5479500bfedf076ad850c59736cb1c71b2683fbb51aba984901f214d659503.png)


#### **The New Stack of Trust**


![Infrastructure with room for "optional trust"](https://img.paragraph.com/cdn-cgi/image/format=auto,width=3840,quality=85/https://storage.googleapis.com/papyrus_images/d2b2a0deeadece5b5357e2b51415d4d7c80abe1478e8f40766cd46b6fcf115f6.png)

In a landscape of more trustless protocols, the base layer stays minimal and predictable. The “green area” above is where optional trust assumptions can be added— gated tokens, curators, governance, oracles, centralized wrappers—depending on what users want. The key difference: these choices happen at the edges, not at the core.

This doesn't mean these trustless protocols can never add trust assumptions. It's quite the opposite: the base layer leaves room for flexibility. Like Uniswap, which is permissionless at its core but still allows both highly centralized and highly decentralized tokens to be traded on top. Often, centralized actors end up choosing permissionless rails, because nothing in the stack blocks them.


### **Summary: Make DeFi Cypherpunk again**

It's not enough to think of "low-risk DeFi" as just a vague category. What would really move the ecosystem forward is stronger recognition—from EF leaders to DeFi builders—of the value in supporting real trustless, inefficient, and boring protocols.

As someone who genuinely enjoys low-risk, low-yield protocols, I'm excited not just by how trustlessness is reshaping finance, but by how it's returning us to the cypherpunk roots. The real breakthrough isn't higher yields, it's eliminating trusted intermediaries entirely. And that breakthrough can only happen on Ethereum, where the base layer itself embodies these same trustless principles.

In Summary:

- Trustless design is what DeFi should be building toward
- Trustlessness—boringness, inefficiency—is a good proxy for low risk DeFi protocol.
**Let's make DeFi Cypherpunk again. Trustless Finance, Powered by Ethereum.**


---

**Notes:**

- [1] The only role that might be somewhat negotiable is the `pauser` role. If an address can only temporarily halt a protocol, I believe it can still fit within a fair framework and does not undermine the overall accessibility of the system (and the ability to objectively "define" accessibility of the system).
- [2] Having no privileged roles also means that protocols should not be upgradable. An upgradable protocol inherently involves some level of access control, which contradicts with "no priviledged roles".
- [3] In this "American, Physical settled" option model, the issuer locks the full value in the contract, mints a token, and the buyer can exercise the token, and execute the "trade" at the strike price anytime before expiry. This design doesn't require any oracle dependency.
