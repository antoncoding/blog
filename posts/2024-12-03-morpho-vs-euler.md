---
title: "Morpho or Euler? Comparing lending hyperstructures"
date: 2024-12-03
tags: ["english", "ethereum", "defi"]
status: "Public"
type: "Post"
---

## **A High-Level Comparison of Euler and Morpho**

this post is also published on [Paragraph.](https://paragraph.com/@emodev/morpho-or-euler-comparing-lending-hyperstructures)

Both Morpho and Euler have been getting a lot of attention lately, and I'm genuinely impressed by both protocols. They're built by top-tier DeFi teams who've created lending protocols as completely decentralized[ hyperstructures](https://jacob.energy/hyperstructures.html).

Also, for the first time in my 4-year DeFi journey, I actually feel very confident recommending protocols to friends and teams. Both Morpho and Euler set the bar for security standards in the industry, and they're built with that true decentralized ethos we've all been waiting for.

Since I started diving deep into these protocols (and building on top of one), I've had countless conversations about them. The topic was especially hot at Devcon, the two names come up very constantly from protocol integration to everyday use. These conversations helped me develop a mental model for understanding both protocols more deeply, and I think it's worth sharing what I've learned.

In this article, I'll focus on comparing their **high-level features** and different approaches. We won't get into the nitty-gritty of implementation details or "coding style" - though those are fascinating topics that deserve their own discussion another day.


---

**Disclosure:*** I hold both $EUL and $MORPHO tokens, and I'm currently building*[ Monarch Lend](https://monarchlend.xyz/)*, a customizable lending platform on top of Morpho. While I serve as a delegate for MorphoDAO, I receive no compensation or direct incentives from either team. Please keep these connections in mind as you read through my arguments.*


### **Monolithic Lending vs Isolated Lending**

Before diving into the actual comparison, let me (re)define the two types of markets a bit more:


#### **Monolithic Lending Market: Multi-Collateral + Mutual Trusted Cluster**

First, I want to define “monolithic”.

**Monolithic Lending Protocols** typically refer to protocols that create one large, unified lending market where "the protocol" is essentially the market itself - like Aave's aUSDC, Compound, or Euler V1. In these markets, assets can be cross-margined, borrowed, and generate yield.

This naturally forms a "mutually trusted cluster" of assets, where each asset shares risk with others in the cluster.

**In this post, I use "monolithic" to describe markets**: If a market resembles an Aave V3 market, I call it a "**monolithic lending market**". These markets typically have two key properties:

1. Enable multiple collateral types to be used together for borrowing
1. Collateral could be borrowed out and generates yield if configured

![Monolithic Market: Different borrowers can borrow DAI from the same pool, with different collaterals](https://img.paragraph.com/cdn-cgi/image/format=auto,width=3840,quality=85/https://storage.googleapis.com/papyrus_images/8e53b7b0550a3fbbdb989ce7e35e987168d977fcf82c78103cea16d19b097c1f.png)

While **EulerV2** functions as a factory for launching various lending markets (from complex monolithic to isolated), its architecture optimizes for **monolithic lending markets** where assets interconnect and supply reuse is encouraged.

So while EulerV2 can support multiple variations, **this discussion focuses on its role in launching monolithic markets**. I'll use "monolithic markets" to describe Euler's flexible markets, while being clear that EulerV2 itself is not a Monolithic Lending Protocol.


### **Isolated Lending: Powered by Simple Loan / Collateral Pairs**

Morpho, in contrast, is a protocol designed to create fully isolated markets. Each market is defined by a single loan-to-collateral asset pair, strictly maintaining this one-to-one relationship.

When creating a more "dynamic lending marketplace," Morpho relies on intermediate contracts called vaults to allocate funds across different underlying markets. You can envision this as liquidity being distributed across various isolated pools, where borrowers with different collateral or oracle preferences need to go to different pools (markets).


![](https://img.paragraph.com/cdn-cgi/image/format=auto,width=3840,quality=85/https://storage.googleapis.com/papyrus_images/992caa1ec26b9ca2ddac38623877ca7961a63e287c95229b413be11b6d864f84.png)

Now that we've set the context, let's dive deeper into understanding the fundamental differences between these approaches. Let me repeat the basic ideas:

- **EulerV2** is a protocol to create almost any flexible lending structures, but primarily focus on **monolithic markets.** When I mention monolithic markets, you can assume I’m also talking about EulerV2
- **Morpho** is a protocol designed to create **isolated lending markets** and other structures to connect them. When I mention isolated lending protocol, you can assume I’m also talking about Morpho.

---


### **Borrowing UX**

The borrower experience on Euler is generally more convenient, primarily due to its flexibility in allowing **multiple collaterals to be used simultaneously**. While Morpho's design requires borrowers to maintain separate positions to borrow against different assets (such as one position for ETH-USDC and another for BTC-USDC), Euler consolidates these into a single position.

Consider a scenario with a large delta-neutral portfolio: in a perfect monolithic market, you could borrow substantial amounts of stablecoins with no liquidation risk. However, in isolated markets, you'd need to manage several positions and monitor liquidation risks across all of them. Even if you have automation liquidation protection tools, the amount you could borrow is still not going to be comparable to monolithic markets.


#### **Borrow Rate Comparison**

An interesting consideration regarding **borrowing rates** is that the isolated approach should theoretically lead to more equitable market rates for each position. For example, borrowing USDC against ETH might carry a 5% rate, while borrowing USDC against LRT might be set at 15%. These rates remain distinct and position-specific. As a borrower with single asset collateral, **you pay exactly how your collateral is being priced.**

In Euler's cluster, markets typically include multiple collateral types (often exceeding 10 different assets), which naturally result in a mixed rate. This might disadvantage users who prefer borrowing against "safer" assets. And intuitively, it benefits those borrowing against riskier assets, like memecoins if it’s ever allowed, as the risk is partially distributed across the safer collateral within the same pool.

So, it would theoretically be cheaper for borrowers with low risk assets to borrow on Morpho. But as it is today, it's hard to observe the rate dynamics in practice, as both protocols are influenced by lots more by other factors that affect rate pricing like reward programs.


#### **Trust Assumptions**

Another consideration is the trust assumption. In monolithic markets, a "governor" entity typically holds rights to update market configurations for managing overall risk. Borrowers must trust these governors won't make drastic changes against their interests, such as lowering the LLTV of their collateral which could trigger liquidations.

Euler V2 addresses this through their [LTV Ramping](https://github.com/euler-xyz/euler-vault-kit/blob/master/docs/whitepaper.md#ltv-ramping) mechanism, which provides significant protection for borrowers against sudden changes.

In contrast, Morpho's underlying markets are immutable and have no concept of "ownership." Borrowers maintain full control over their positions. This gives borrowers in isolated lending pools more autonomy over factors affecting their positions.


#### **Capital Efficiency and Rehypothecation**

This is a relatively easy one, **collateral rehypothecation** is one clear advantage of Euler and its monolithic markets, allowing borrowers to earn interest while simultaneously providing liquidity to another lending market.

In Morpho's design, collateral deposited into markets cannot be borrowed out. This is less efficient but prevents some annoying issues, such as borrowers being unable to withdraw their collateral. People can theoretically loop things and borrow with the “yield bearing collateral”, but that’d be another market that you have to source liquidity first.

A simple way to understand the efficiency difference is through a "mutual lending" scenario: Imagine Alice has ETH and wants to borrow DAI, while Bob has DAI and wants to borrow ETH. In Euler's monolithic market, they can efficiently borrow using each other's collateral directly. However, in Morpho's isolated markets, each person would need to find separate suppliers for their loans. This illustrates how monolithic markets can create natural synergies between borrowers and lenders with complementary needs.


![In Euler, Alice and Bob can essentially borrow each others' collateral. In Morpho, collateral are always locked and cannot be borrowed.](https://img.paragraph.com/cdn-cgi/image/format=auto,width=3840,quality=85/https://storage.googleapis.com/papyrus_images/c599052686f437d7dbda8d60fa07e92961141da8d9e0011cde2dae31f05f19bf.png)


#### **Do(n’t) Trust the TVL**

An interesting implication of this appears in the TVL: with Morpho, TVL typically correlates directly with protocol growth - as more people borrow or lend, the TVL consistently increases. In contrast, with Euler V2, it's possible for TVL to decline even as “protocol usage” grows, for example if many passive lenders become active borrowers, they would just start taking money out of the protocol with their existing supplies as collateral.

P.S. Euler V2 can theoretically accommodate both approaches through its **escrow vaults** (where collateral can't be borrowed) and normal borrowable vaults. But in clusters that offer both options, liquidity would go toward borrowable vaults. This makes practical sense: since borrowers are already exposed to shared market risk when they borrow, they're all incentivized to earn additional yield on their collateral.


### **Liquidity Aggregation / Fragmentation**

Here comes my favorite comparison part: liquidity. This is literally the question **everybody** asks: "Which protocol will have better liquidity?"

It's a good question, but not a great way to ask it. It's too vague, and any answer could make sense. That's why I believe we should focus on these two questions instead:

1. "Where does liquidity get aggregated or divided?"
1. "Where are the network effects?"

### **Monolithic Markets:**


#### **Liquidity aggregates everywhere within clusters**

In monolithic systems, liquidity concentration happens within single clusters, naturally leading to having a primary cluster - just like how DeFi lending was heavily concentrated in Compound's cUSDC, Aave's aUSDC, and Euler V1 before 2023.

All liquidity within a cluster is essentially "shared" - onboarding a new asset (either as collateral or having a market) into the cluster is relatively easy, and users can enjoy an expanding selection of collateral assets.


#### **Where is the Network Effect -- Primary Markets and Tokenization**

The network effect primarily manifests at the tokenized vault level (market level) - a successful USDC vault aggregates substantial lender and borrower activity, creating a centralized hub for USDC liquidity.

All suppliers and borrowers can come to a big connected market. Very intuitively, this aggregates lots of different sources of liquidity, and let all users share the same fungible token for the supplied asset.

These tokenized assets often gain broader acceptance and can be utilized in various ways, such as Curve's spot markets or derivative markets like Hyperdrive or Pendle, or even function as interest-bearing stablecoins. I believe this effect would be even more amplified in DeFi, as ERC20 integration is very well-explored and people are very familiar with integration based on this interface.

IMO this is one of the biggest advantages of monolithic markets: once you reach a certain scale and everyone considers it "big enough," it's not just a tokenized supply position anymore - it's actual money that even "protocols" could hold.


#### **Liquidity fragment between clusters**

Euler V2 can be used to launch completely separate monolithic markets, but launching a new cluster means starting everything from scratch. One great feature of Euler V2 is that it's very easy to "connect collateral vaults" from other clusters, allowing users with supply positions to come to your cluster and borrow. However, this means inheriting the risk of the original market, and it only solves part of the problem on the borrowing side - you still have to start from zero to find suppliers.

You can see this on Euler Explorer too: currently, the biggest cluster outside of "Euler Prime" is the Stablecoin Maxi by Re7. Looking at[ the details](https://www.explorer.euler.finance/1/0xce45EF0414dE3516cAF1BCf937bF7F2Cf67873De), it's practically just operating as a single USDC-sUSDe market, not really gaining traction as a "monolithic cluster."


![Euler Prime Vaults dominate as the primary "cluster" on EulerV2](https://img.paragraph.com/cdn-cgi/image/format=auto,width=3840,quality=85/https://storage.googleapis.com/papyrus_images/c0ba6c7f42782312f326b1f4f7234dd426fbb8cb77539dc363ae9845470dbe99.png)

We're still way too early to judge Euler V2's growth, but this is likely the biggest obstacle going forward for Euler to truly expand its vision of being the protocol that serve as a framework to connect “multiple monolithic markets”.


### **Isolated Lending**


#### **Liquidity fragment between borrowable markets**

Morpho-style protocols operate differently - top-layer vault contracts only function as aggregators, so liquidity isn't truly "pooled" together from a single supply flow's perspective; instead, it's divided into different markets. The actual "supply and borrow" activities happen in these base markets, making it more challenging for intermediate vaults to achieve strong network effects where everyone naturally gravitates to one place for liquidity. Instead, **vaults must continuously compete with each other** based on yield and risk profiles.

This doesn't mean it's impossible to develop a vault big enough to become a "popular ERC20" - it's just a lot harder to reach that scale. However, once achieved, a vault can tap into the “ERC20 lego ecosystem” we discussed, and what's cool about Morpho is that when one vault succeeds, **it helps pull others up with it**.


#### **Liquidity aggregates from different sources into “markets”**

All vaults share the same underlying “markets”, so any vault growth can indirectly help others as well, as there will be more liquidity into the base layer, we can expect more borrowers to come because of the liquidity, and all vaults benefit from using some of the shared markets.

One key advantage that I think we’re starting to see now, is that it’s relatively easy to **launch a new vault** without worrying about the starting liquidity. When you first start a vault, you’re not trying to create a new market so to speak, you’re just trying to create a good strategy for people to distribute their supplies. You already have other lenders and borrowers in those pools, so you don’t have to worry about the cold start problem.


#### **Network Effect** **could happen across use cases**

Consider two suppliers: one wants a very low-risk 3% yield, while another seeks the most degen strategy with the highest possible returns. Usually, these suppliers would never combine their liquidity, but in Morpho, some of their funds might end up "pooled" together, perhaps in one of the semi-risk markets.

The unique network effect here emerges when different "groups" can mix together. This means the Morpho ecosystem can more easily expand to fit literally everyone's risk appetite without starting liquidity from scratch for each use case. If you check out the[ markets page](https://www.monarchlend.xyz/markets) of **Monarch (yes, the platform I built)**, you'll see many more adventurous markets being created.


---


### **TradFi Integrations**

Let's briefly talk about how both protocols can accommodate TradFi or institutional liquidity while addressing **compliance concerns**.

Euler's “Controller vault based” architecture makes it straightforward to create whitelist-only markets where only approved actors can supply or borrow. This is particularly useful for institutional participants who need to operate within regulatory frameworks, you can govern all borrowers and suppliers easily by adding hooks to each markets in the trusted cluster.

Morpho can supports "permissioned markets" through a different approach - by wrapping tokens into permissioned ERC20s. For example,[ one market](https://app.morpho.org/market?id=0x83262d91702f90d9edf6c737ceb46e59a2bcfc7ba856e1e8448b7824f83a07e3&network=base) achieves this on Base by wrapping USDC into verUSDC, ensuring only KYC'd users can borrow.

The strength of Euler's approach lies in its ability to efficiently create compliant clusters for multiple assets. While Morpho's approach is more indirect, but it also demonstrates how a minimum primitive can be adapted to build any type of market structure.


---


### **Underlying Hypothesis**

I want to also mention how the architectural choices reflect different fundamental assumptions about DeFi lending. What we talked about in the previous sections kind of implied this already, the two teams are solving “DeFi lending” differently because they saw different bottlenecks in scaling, and therefore invented different systems to address it. But here I want to zoom out even more and try to think about the underlying ethos and hypothesis of each protocol.


#### **Monolithic Lending: Compete as Alliances and Scale with Higher Efficiency**

The **monolithic** approach prioritizes concentrated liquidity, based on the assumption that combining borrowers and suppliers with different collateral preferences and risk tolerances creates **net benefits**. This architecture believes that as more assets join a mutually-trusted cluster, they bring multiple groups together and scale as one entity. As mentioned earlier, this could become particularly powerful in the **ERC20 DeFi lego ecosystem** if we experience another DeFi renaissance.

Also, monolithic lending focus on capital efficiency. This resonates with how Euler V2 constructed their vault-based architecture to encourage **reuse of vaults** – supplies could be used as collateral easily in many different new markets. With more utilities provided to suppliers, the lower the opportunity cost and hence increased supply-side liquidity.

An unavoidable challenge with this approach is governance and management at scale. While Euler V2, as a framework for launching multiple monolithic markets, **could potentially "sidestep" this bottleneck by enabling different clusters**, the system still requires more trust at various levels - for instance, market terms being governable affects everyone in the cluster.

Though Euler V2's framework is sufficiently decentralized that users don't need to trust governors to act benevolently (it's built so that even malicious governors can't cause catastrophic damage), the core tradeoff remains clear: the markets created by Euler likely favor efficiency and concentrated liquidity at the cost of introducing (external) governance.


#### **Isolated lending: Connect Liquidity Sources with zero Trust Assumption**

**Isolated lending**, by contrast, embraces the philosophy that mixed markets have inherent limitations—no single market can satisfy all users, and what's essential is a shared, ungoverned base layer that all activities can share. This underlying "isolated" property enables people to build whatever they want without requiring trust.

Here's what I see as the hidden hypothesis: Morpho represents the only path to bringing more "truly decentralized liquidity" into the existing DeFi lending landscape, as it eliminates the need for bureaucracy and governance politics that often stands in the way. There might be many undiscovered DeFi lending use cases that most lending markets overlook, but which become possible within the Morpho ecosystem.

A great example is "protocol-owned" supplies and interest. I recall a discussion at Lyra ([now Derive](https://www.derive.xyz/)) about whether we should "just accept Aave’s aUSDC instead of USDC" for all deposits into our rollup. The pros included up to millions in annual revenue from interest; the cons were that the company's fate would depend entirely on another protocol. Everyone wanted the yield, but the lack of control was impossible to accept when the whole team's future was at stake.

I believe there are many such "lightweight use cases" that could quickly become viable if the risks were manageable, and the liquidity problem is solved by default. Had Morpho been an option back then, we could have easily created a vault to start earning interest while **maintaining full control** over which markets we supplied to, giving our protocol full control to not waste that idle liquidity.

Coming back to the original point, what I like about this philosophy is its **ungoverned approach** to DeFi, viewing the loss in capital efficiency as a necessary trade-off for achieving total decentralization within their ecosystem.


#### **My DeFi option journey Déjà Vu**

I believe the "philosophy" behind each approach reveals the hidden value behind each team. Writing about this post reminds me of how different teams approached DeFi options back in the day: Some tackled the problem by focusing on "bringing TradFi liquidity onchain," prioritizing capital efficiency and trader experience, while others built simple, fully-decentralized, physically-settled options with no oracle, hoping to teach the world about the power of a single option position rather than merging 32 positions to trade volatility with portfolio margining.

I see the pro-efficiency trader approach as similar to how Euler views problems, while the minimally-governed approach aligns more with how Morpho is built. Though **practically speaking**, both Morpho and Euler are less constrained in their direction and actual use cases: Morpho still provides a smooth path for institutions to connect liquidity into DeFi, and Euler is flexible enough to cover use cases including "isolated markets." What I really want to highlight here is the **key focus in their design choices**, which reflects their core vision.

You can see this even more clearly in their codebases: Morpho takes a minimalist approach, focusing on coding the base market and be un-opinionated as possible, while Euler chose a more general and modular approach, potentially supporting a wide range of use cases like launching a synthetic stablecoin.

I recommend studying both protocols extensively to understand their contrasting design philosophies, and I’m sure you will find the beauty in both minimalist approach and a modular framework. From a protocol design perspective, both teams offer valuable lessons in architectural choices and tradeoffs.


### **Closing**

Despite their fundamental differences, these protocols share one crucial similarity at the protocol level: they are both built as totally immutable **public goods**. This design ensures they will always work for everyone and provides flexibility for building different applications on top, all while maintaining **zero trust assumptions**. So even with their "key differences," both protocols offer far more potential than limitations.

Their distinct approaches to DeFi lending aren't competing philosophies but rather complementary DeFi lego pieces, each pushing the boundaries of what's possible in DeFi.

The beauty of DeFi is that we don't have to choose between these approaches - they WILL coexist and thrive together, serving different needs in the ecosystem. As I always tell people: in the end, what matters most is that DeFi users win. This is truly what I expect to see in the upcoming DeFi summer ☀️


---

Thanks @Crotts__, @MerlinEgalite, @JackChai0922 for review and feedback!
