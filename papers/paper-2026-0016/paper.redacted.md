# [Replication] Calibrating the dictator's dilemma: a formal replication of Gehlbach, Luo, Shirikov, and Vorobyev (2025)

## Abstract

This paper formally replicates Gehlbach, Luo, Shirikov, and Vorobyev (2025, *AJPS*), "Is there really a dictator's dilemma? Information and repression in autocracy." Every algebraic identity, lemma, proposition, and online-appendix extension is independently re-derived from the model primitives. All twelve formal claims hold as stated; the math is correct. The single repressiveness parameter $\omega$ binds the cost-of-mobilization channel and the public-signal-noise channel to the same scalar, and the conditional structure of the headline (Proposition 3 versus Proposition 4) is a property of that lockstep. Online Appendix B's intelligence-quality parameter $\lambda$ already partially decouples information from $\omega$, and a two-parameter generalization that fully separates the channels is a natural agenda for follow-up work. A single-instance worked example illustrates that the headline direction is generic to "add an information channel" arguments. The conditional, by contrast, is sensitive to the lockstep modeling choice.

## 1. Introduction

This paper is a formal replication of Gehlbach, Luo, Shirikov, and Vorobyev's (2025) *AJPS* article on the so-called dictator's dilemma. Every formal claim in the published paper (three lemmas, four main-text propositions, one optimal-design result, and two online-appendix extensions) is re-derived independently from the model primitives. The math is correct. Algebra checks pass with zero serious findings; the deductive structure is sound; an independent zero-context rebuild reaches the same headline direction. The replication's contribution is therefore calibration of substantive interpretation, not refutation of derivation.

The published model encodes "repressiveness" as a one-dimensional parameter $\omega$ that governs both the mobilization-cost function $\pi(\omega)$ and the public-signal-noise function $q(\omega)$. The two functions are independent primitives, but they are evaluated at the same scalar argument; as $\omega$ moves, $\pi(\omega)$ and $q(\omega)$ co-move along a one-dimensional curve in $(\pi,q)$-space. Proposition 3 establishes that elections raise optimal repression when the cap on feasible repression binds below a threshold $\hat\omega$; Proposition 4 reverses the comparative static when the cap binds above. The replication's first-order observation is that the conditional structure of this headline is a property of the lockstep $(\pi,q)$ assumption. Online Appendix B's intelligence-quality parameter $\lambda$ already partially decouples information capacity from $\omega$, and the original explicitly discusses $\omega$ as "repressive capacity" in a footnote. A two-parameter generalization in which mobilization-cost capacity $\omega^c$ and information-friction capacity $\omega^s$ move independently is a natural object to study; this paper does not derive it. What this paper does is articulate the modeling commitment, locate it in the original's own discussion, and document what the lockstep buys.

A second observation, smaller in scope, concerns abstract phrasing. The headline that "the manipulation of information through such non-repressive means can allow for more rather than less repression" is conditional on $\omega_{\max}\le\hat\omega$. Both the introduction (Gehlbach et al. 2025, p. 382) and the conclusion (p. 392) of the original retain the conditional explicitly; one sub-clause of the abstract compresses it. The compression is a copy-editing observation, not a substantive misframing of the result. This paper notes the compression for the record and does not treat it as the load-bearing contribution.

This paper makes three contributions. First, it provides an independent algebraic re-derivation of every formal claim in the original, with sympy verification of identities involving nontrivial cancellation; the verification grid documents that the math is sound. Second, it locates the lockstep $(\pi,q)$ representation as the structural commitment driving the conditional structure of the headline, connects this commitment to the original's own Online Appendix B treatment of $\lambda$, and sketches what a two-parameter generalization would have to characterize. Third, it discusses the model's empirical scope conditions: when the channels are jointly operated (modal contemporary autocracies, where the same coercive organ both surveils and represses) versus structurally separated (the historical Soviet KGB / East German Stasi pattern), the empirical relevance of the lockstep critique differs. The contribution is to the formal-theory-of-autocracy literature in which Gehlbach et al. sits, not to its empirical content.

## 2. Position in the literature

The Gehlbach et al. model belongs to a formal-theory-of-autocracy tradition that studies how rulers manage information and coercion jointly. Recent contributions have characterized the punisher's dilemma (Bueno de Mesquita, Myatt, Smith, and Tyson 2024; Tyson and Smith 2018), the political economy of repression and information manipulation (Egorov and Sonin 2024; Egorov and Sonin 2021; Gitmez and Sonin 2023), the role of public signals and revolution (Bueno de Mesquita and Shadmehr 2023; Shadmehr and Bernhardt 2011), and the formal economics of informational autocracy (Guriev and Treisman 2020; Guriev and Treisman 2022; Tyson 2018; Little 2017). A parallel line on the strategic value of elections and propaganda in autocracy (Gehlbach and Sonin 2014; Gehlbach and Simpser 2015; Luo and Rozenas 2018a, 2018b) studies devices that supply information to the regime, the citizenry, or both. The Gehlbach et al. headline sits in this lineage: a Bayesian-persuasion-style election (Kamenica and Gentzkow 2011) is grafted onto a repression-and-information game, and the comparative statics on optimal repression are characterized. The paper thereby joins formal models that analyze repression and information jointly rather than as substitutes (see also Di Lonardo, Sun, and Tyson 2020 on autocratic stability).

The empirical and comparative-authoritarianism literature provides the substantive scope conditions against which any such model is read. Work on the institutional architecture of authoritarian rule (Svolik 2012; Geddes, Wright, and Frantz 2014, 2018; Wintrobe 1998), on competitive and electoral authoritarianism (Levitsky and Way 2010, 2022), on coercive institutions (Greitens 2016; Slater 2010), and on contemporary Russia in particular (Frye 2021), all describe organizational forms of repression that the formal model does not commit to. Section 6 below uses this literature to scope the empirical content of the lockstep critique: the critique has more bite for regimes whose security and information functions are organizationally separated than for regimes in which a single agency operates both.

A note on genre. Formal-theory replications have no settled venue in political science, in contrast with economics, where the *American Economic Review* publishes "Comments" that re-derive and challenge prior formal results (Acemoglu, Johnson, and Robinson 2012 illustrates the practice in a closely related literature) and where economics has a small replication tradition that has become more visible (Bertrand and Mullainathan 2004 is a canonical empirical example whose findings have been subject to reanalysis). Formal political economy occasionally engages prior formal work via comment-and-reply (Bueno de Mesquita 2010 on regime change, for example). This paper sits in that tradition: an independent re-derivation of a published model whose function is calibration of how the result should be read, not refutation. The literature on which the present replication draws and the audience to whom it is addressed are jointly the formal-theory-of-autocracy community whose central question Gehlbach et al. revisits.

## 3. The original model and its headline

The Gehlbach et al. model has two players, a ruler $R$ and an opposition $O$, and a binary state $\theta\in\{0,1\}$ encoding whether the regime is popular ($\theta=1$) or unpopular ($\theta=0$). The common prior is $\Pr(\theta=1)=p\in(0,1-k)$, where $k\in(0,1)$ is the opposition's cost of challenging. A public signal $s\in\{0,1\}$ realizes with $\Pr(s=1\mid\theta=1)=1$ and $\Pr(s=1\mid\theta=0)=q(\omega)$. Repressiveness $\omega\in\mathbb{R}_+$ enters two functions: the survival probability under mobilization $\pi(\omega)$ and the false-positive rate $q(\omega)$. Both are continuous and strictly increasing, with $\pi(0)=q(0)=0$ and $\lim_{\omega\to\infty}\pi(\omega)=\lim_{\omega\to\infty}q(\omega)=1$. After observing $s$, the ruler chooses mobilization $\mu\in\{0,1\}$ and the opposition chooses challenge $c\in\{0,1\}$; payoffs follow the standard mobilize-or-not, challenge-or-not structure with ruler survival $\mu+(1-\mu)(1-c+c\theta)$. The solution concept is perfect Bayesian equilibrium.

The posterior given $s=1$ is $\tilde p(\omega,p)=p/[p+(1-p)q(\omega)]$, strictly decreasing in $\omega$. The threshold $\underline{\omega}(p)$ is defined by the indifference condition $1-\tilde p=k$ and equals $q^{-1}(\frac{k}{1-k}\cdot\frac{p}{1-p})$. Above this threshold the opposition is willing to challenge after $s=1$; below it the public signal alone deters challenge. The threshold's intuitive content: when $\omega$ is small enough that $s=1$ is highly informative about $\theta=1$, the opposition's posterior on the regime being popular exceeds $1-k$ and challenging is unprofitable; raising $\omega$ degrades the signal, eventually pushing the posterior below $1-k$ and making the opposition willing to challenge.

A second threshold $\bar\omega(p)$ characterizes the ruler's mobilization decision in the no-elections game. At $\bar\omega(p)$, the ruler's payoff from not mobilizing (equal to $\tilde p$, the posterior probability of survival without mobilization given a challenge) equals the payoff from mobilizing (equal to $\pi(\omega)$). Below $\bar\omega$ the ruler prefers not to mobilize and accept the challenge; above it the ruler prefers to mobilize. The two thresholds together carve the parameter space into the three regimes that drive Proposition 1.

The model adds a Bayesian-persuasion-style election in a parallel game. The ruler designs an election $\tau=(\tau_0,\tau_1)$ with $\tau_\theta=\Pr(v=1\mid\theta)$, observed by the opposition before its challenge decision. The constraint that the opposition be deterred after a "good" election outcome $v=1$ is $\Pr(\theta=1\mid s=1,v=1)\ge 1-k$, equivalently $\tau_0\le\frac{k}{1-k}\cdot\frac{p}{1-p}\cdot\frac{1}{q(\omega)}\cdot\tau_1$. Maximizing the probability of $v=1$ subject to this constraint and to $\tau_0\le\tau_1\le 1$ gives the optimal design (equation 4 of the published paper): $\hat\tau_1=1$ and $\hat\tau_0=\frac{k}{1-k}\cdot\frac{p}{1-p}\cdot\frac{1}{q(\omega)}$. The expected payoff under $\hat\tau$ when $s=1$ and $\omega>\underline{\omega}(p)$ is $\tilde p(\omega,p)/(1-k)$, an inflation of the bare posterior by the factor $1/(1-k)$ — the survival benefit of the optimal election. With elections, the mobilization-vs-no-mobilization indifference threshold rises from $\bar\omega$ to a new threshold $\bar\omega_E$ at which $\tilde p/(1-k)=\pi(\omega)$.

Three lemmas, four propositions, and the optimal-design result drive the headline.

- **Lemma 1.** A unique threshold $\bar\omega(p)>0$ satisfies $\tilde p(\omega,p)\ge\pi(\omega)\Leftrightarrow\omega\le\bar\omega(p)$, with $\bar\omega(p)>\underline\omega(p)\Leftrightarrow p<\bar p<1-k$.
- **Lemma 2.** A unique threshold $\bar\omega_E(p)>\max\{\bar\omega(p),\underline\omega(p)\}$ satisfies $\tilde p(\omega,p)/(1-k)\ge\pi(\omega)\Leftrightarrow\omega\le\bar\omega_E(p)$.
- **Lemma 3.** The cutoffs $\hat\omega:=\inf\{\omega>\underline\omega:U(\omega)>U(\underline\omega)\}$ and $\hat\omega_E:=\inf\{\omega>\underline\omega:U_E(\omega)>U(\underline\omega)\}$ satisfy $\underline\omega\le\hat\omega_E\le\hat\omega<\infty$.
- **Proposition 1.** Without elections, the equilibrium is described by three cases on $\omega$ relative to $\underline\omega$ and $\bar\omega$.
- **Proposition 2.** With elections, the equilibrium is described by three cases on $\omega$ relative to $\underline\omega$ and $\bar\omega_E$.
- **Proposition 3 (complements).** If $\omega_{\max}\le\hat\omega$, then $\omega^*\le\omega_E^*$, with strict inequality iff $\omega_{\max}>\hat\omega_E$.
- **Proposition 4 (substitutes).** If $\omega_{\max}>\hat\omega$ and $(1-q(\omega))\pi(\omega)$ is single-peaked on $[\underline\omega,\bar\omega_E]$, then $\omega^*\ge\omega_E^*$.

Online Appendix A reformalizes repressiveness as the cost of challenging through a formidability indicator $\phi$; Online Appendix B introduces a private signal $z$ to the ruler with intelligence-quality parameter $\lambda$, with the convergence claim in Proposition A2.

The published paper summarizes these results in the opening sentence of its abstract: "The manipulation of information through such non-repressive means can allow for more rather than less repression." The introduction (p. 382) and the conclusion (p. 392) qualify this with explicit statements that the optimal level of repressiveness depends on the ease of building a repressive state.

For full statements and proofs, the reader is referred to Gehlbach et al. (2025, pp. 384–392 and Appendix A; Online Appendices A and B in the supplement).

## 4. Independent verification of the formal claims

Every claim was re-derived without consulting the published proofs, with sympy used to mechanically check identities that involve nontrivial algebraic cancellation (the posterior identities, the optimal-design expected payoff, the boundary-jump computation in Lemma 3, and the LP solution behind the optimal election). The full per-claim verdicts are below.

| Claim | Algebra | Logic | Notation/plausibility | Composite |
|---|---|---|---|---|
| Posterior $\tilde p(\omega,p)$ identities | PASS | PASS | PASS | PASS |
| Threshold $\underline{\omega}(p)$ well-defined | PASS | PASS | PASS | PASS |
| Lemma 1 (existence/uniqueness of $\bar\omega(p)$) | PASS | PASS | PASS | PASS |
| Lemma 2 (existence/uniqueness of $\bar\omega_E(p)$) | PASS | PASS | PASS | PASS |
| Lemma 3 ($\underline\omega\le\hat\omega_E\le\hat\omega<\infty$) | PASS | PASS | PASS | PASS |
| Optimal election design $\hat\tau$ (eq. 4) | PASS | PASS | PASS | PASS |
| Proposition 1 (baseline equilibrium, 3 cases) | PASS | PASS | PASS | PASS |
| Proposition 2 (election equilibrium, 3 cases) | PASS | PASS | PASS | PASS |
| Proposition 3 (complements: $\omega^*\le\omega_E^*$) | PASS | PASS | PASS | PASS |
| Proposition 4 (substitutes: $\omega^*\ge\omega_E^*$) | PASS | PASS | PASS | PASS |
| Proposition A1 (cost-of-challenging variant) | PASS | PASS | PASS | PASS |
| Proposition A2 (private signal, $\lambda\to 1$) | PASS | PASS | PASS | PASS |

All twelve formal claims survive independent algebraic re-derivation. Two minor typographical issues are noted for the record. The IVT setup in the Proof of Lemma 1 (Gehlbach et al. 2025, p. 394) writes $\lim_{\omega\to\infty}[\tilde p(1,p)-\pi(1)]=p-1<0$; the arguments inside the brackets should be $\omega$, not $1$. The limit value is correct. Online Appendix A's side condition $1-k<f$ is presented in passing rather than as a numbered display; readers transferring intuition from the main model to the cost-of-challenging variant need to know that $f$ is restricted to be sufficiently large. Neither issue affects any formal conclusion.

## 5. The headline and its conditional structure

Proposition 3 establishes that $\omega^*\le\omega_E^*$ when $\omega_{\max}\le\hat\omega$, with strict inequality when $\omega_{\max}>\hat\omega_E$. Proposition 4 establishes the reverse, $\omega^*\ge\omega_E^*$, when $\omega_{\max}>\hat\omega$ and $(1-q)\pi$ is single-peaked on $[\underline\omega,\bar\omega_E]$. The headline that elections produce more rather than less repression is therefore the Proposition 3 case: the cap $\omega_{\max}$ on feasible repression has to bind below the threshold $\hat\omega$, and the Proposition 4 region (where the cap binds above $\hat\omega$) reverses the comparative static.

The empirical content of $\omega_{\max}\le\hat\omega$ is "building a repressive apparatus is sufficiently costly that the cap binds before the strict-mobilization region." Below $\hat\omega$, raising $\omega$ above $\underline\omega$ is suboptimal without elections, since the loss of the deterring public-signal informativeness outweighs the cheaper-mobilization gain, so $\omega^*=\underline\omega$. With elections, the optimal design replaces the missing deterrent and lets the ruler raise $\omega$ profitably; $\omega_E^*>\underline\omega$ when $\omega_{\max}>\hat\omega_E$. The complementarity arises precisely because the ruler is in a region where, absent elections, raising $\omega$ would not have paid off.

When $\omega_{\max}>\hat\omega$, the unconditional gain from raising $\omega$ above $\underline\omega$ is positive even without elections, and the optimum sits in the interior of the strict-mobilization region. Adding elections then redistributes mass between the no-mobilize and mobilize regions of the optimization, and the single-peakedness of $(1-q)\pi$ implies the no-elections optimum on $(\underline\omega,\bar\omega)$ is also the with-elections optimum on the broader interval $(\underline\omega,\bar\omega_E)$. Elections allow the ruler to capture survival gains on the no-mobilize side without raising $\omega$; the comparative static reverses.

The threshold $\hat\omega$ depends on the unobserved primitives $p$, $k$, $\pi(\cdot)$, and $q(\cdot)$ and is not operationalized against any specific autocracy in the published paper. Estimating $\hat\omega$ for any real regime requires committing to functional forms for $\pi$ and $q$ and then computing the cutoff numerically. Standard observables (security-sector budget, censorship intensity, share of the citizenry experiencing direct surveillance) are at best proxies for $\omega$ itself; positioning a regime relative to $\hat\omega$ would additionally require estimates of $\pi$ (the marginal mobilization-success benefit of repression) and $q$ (the marginal information-loss). The empirical content of the headline is therefore conditional on objects that are not currently measured.

A subsidiary observation concerns one sentence of the abstract. The opening line ("the manipulation of information through such non-repressive means can allow for more rather than less repression") compresses the conditional. The paper's introduction (p. 382) states explicitly that the result "depends critically on whether [building a repressive state is comparatively easy or hard]," and the conclusion (p. 392) restates that the direction "depends on the ease of building a repressive state." The conditional is therefore preserved in two of the three high-visibility positions in the original. The compression is a sub-clause of the abstract; it is not a body-text overclaim. This paper notes the compression for the record without elevating it to a load-bearing finding.

A second comparative-statics distinction is worth keeping in view. At any *fixed* $\omega>\underline{\omega}(p)$, elections raise the ruler's survival probability by a factor of $1/(1-k)$ unconditionally. At the *optimal-choice* level, whether elections raise the ex-ante optimal $\omega^*$ is the Proposition-3-versus-Proposition-4 dichotomy: conditional. The original is consistent on this distinction across the introduction and conclusion; a casual reader of the abstract alone could conflate the two.

## 6. The single-parameter binding

The published model encodes "repressiveness" as a one-dimensional parameter $\omega$ that governs both $\pi(\omega)$ and $q(\omega)$. The two functions are independent primitives, but they are evaluated at the same scalar argument; as $\omega$ moves, $\pi(\omega)$ and $q(\omega)$ co-move along a one-dimensional curve in $(\pi,q)$-space. The lockstep is a modeling commitment with empirical content: it asserts that the operator of the regime's repressive technology cannot independently calibrate its mobilization-cost effect and its information-friction effect. The original is explicit on this point. Footnote 1 of Gehlbach et al. (2025, p. 381) characterizes $\omega$ as "repressive capacity" and signals that the joint loading on $\pi$ and $q$ is a deliberate simplification.

The conditional structure of the headline is a property of this lockstep. Proposition 4's substitutes case rests on $(1-q(\omega))\pi(\omega)$ being single-peaked on $[\underline\omega,\bar\omega_E]$, a joint property of $\pi$ and $q$ evaluated along the same curve. The single-peakedness condition is statable only because the two functions share an argument; under a two-parameter generalization it would have no direct analogue. A two-parameter representation in which mobilization-cost capacity $\omega^c$ governs $\pi(\omega^c)$ and information-friction capacity $\omega^s$ governs $q(\omega^s)$ separates the channels and replaces the one-dimensional optimization with a two-dimensional one whose FOCs in $\omega^c$ and $\omega^s$ decouple. Whether $\omega^{c*}$ rises with elections becomes a question about the mobilization-cost FOC; whether $\omega^{s*}$ rises is a question about the information-friction FOC. The fixed-$\omega$ result (survival rises by $1/(1-k)$) generalizes immediately, since it depends only on the optimal-design payoff. The optimal-choice result splits into two.

This paper does not derive the two-parameter analogue. The claim here is more measured. The lockstep is a modeling choice with empirical content; the conditional structure of the headline is a property of that choice; what the analogue would look like under a separated-channels representation is an open question. Working out the analogue with proved comparative statics is a research agenda for follow-up theory work, not a result the present replication establishes.

The original is closer to this position than a one-parameter framing alone would suggest. Online Appendix B introduces a private signal $z\in\{0,1\}$ to the ruler with $\Pr(z=1\mid\theta)=\theta+(1-\theta)\lambda$; smaller $\lambda$ corresponds to a more discriminating private signal, that is, to higher intelligence quality. The parameter $\lambda$ is a primitive that lives separately from $\omega$ and from $\pi$ and $q$. As $\lambda\to 1$, the private signal degenerates and Online Appendix B's equilibrium converges to the baseline (Gehlbach et al. 2025, Proposition A2). For $\lambda<1$, the equilibrium is qualitatively richer: the ruler conditions on $z$ in addition to $s$, mixed strategies arise in a "moderately low" $\omega$ region, and the four-region structure is not present in the main-text model. Substantively, $\lambda$ is an information-side primitive that is decoupled from the mobilization-cost-side primitive. The Online Appendix B model is therefore a partial decoupling already: information capacity is governed by $\lambda$ and $q(\omega)$ jointly rather than by $\omega$ alone. The proposed $(\omega^c,\omega^s)$ generalization is, in this sense, in the spirit of Online Appendix B's $\lambda$ — pushing the decoupling further so that the cost channel and the information channel each have their own primitive, and the joint single-peakedness condition is replaced by separate first-order conditions.

A single zero-context worked example helps illustrate that the headline direction is generic to "add an information channel" arguments and is not specific to the lockstep representation. An independent reconstruction read only from the abstract and introduction, without the model body, produced a two-parameter formulation in which repression $r\in[0,1]$ multiplicatively dampens an overt signal channel, election accuracy $\alpha\in[1/2,1]$ enters as a separate parameter, and mobilization cost is governed by $r$ alone through a convex term. In this alternative formulation, adding elections strictly raises optimal $r^*$ for any $\alpha>1/2$ in the interior of the parameter space, unconditionally. The example is a single instance, not a robustness battery; what it shows is that the *direction* of the headline (information channel raises optimal repression) is reachable without the lockstep. The conditional structure (when the channels complement versus substitute) is not present in the example. This is a single-instance illustration of the structural claim, not a finding about robustness across model classes.

## 7. Sensitivities and scope

The threshold $\hat\omega$ that separates Proposition 3 from Proposition 4 is unmeasured. The verbal interpretation "when building a repressive apparatus is comparatively difficult" is not operationalizable from any observable that has been mapped to a real autocracy. Whether the headline applies to any specific case depends on the case's position relative to $\hat\omega$; that position is not currently estimable.

The Wintrobe-style assumption that $q(\omega)$ is strictly increasing is the central modeling commitment of the model (Wintrobe 1998 sets out the broader trade-off). With $q(0)=0$ and $\lim_{\omega\to\infty}q(\omega)=1$, the model encodes the assertion that, when the regime is unpopular, the probability of a "support" signal grows monotonically from zero to one as repressiveness rises. Some prior work has noted that more repressive regimes can sometimes raise the discriminating power of an observed signal because forced-extreme separating behavior produces sharp distinctions; the strictly-increasing $q$ rules this out. The published paper presents the assumption as a modeling choice, not an empirical claim. The replication confirms that the headline depends on the choice.

Proposition 4's substitutes case rests on $(1-q(\omega))\pi(\omega)$ being single-peaked on $[\underline\omega,\bar\omega_E]$. Sufficient conditions exist (concave $\pi$ plus log-concave $q'$) and are reasonable shape restrictions, but they are unverified for any specific empirical parameterization. Concave $\pi$ rules out S-shaped mobilization technologies with increasing returns at low capacity, and log-concave $q'$ is a regularity condition on the citizen-cost CDF that has not been tested. When single-peakedness fails, $\omega^*$ and $\omega_E^*$ may not be ordered; the dichotomy between Propositions 3 and 4 is replaced by a richer pattern that the published paper does not characterize.

The empirical scope of the lockstep critique depends on the organizational form of the regime's coercive apparatus. In the contemporary modal autocracy, a single agency typically operates both surveillance and mobilization functions: Russia's FSB combines intelligence collection with coercive operations (Frye 2021); China's Ministry of State Security, Cuba's MININT, and Iran's IRGC follow comparable patterns; Singapore's Internal Security Department combines intelligence and coercive capacities under a single authority. In organizations of this type, the regime's $\pi$-side and $q$-side investments are made by the same actor and are plausibly more correlated than they would be under a structurally separated organization; the lockstep representation is closer to the modal contemporary case than a clean $\pi$/$q$ separation would be. The historical Soviet KGB / East German Stasi pattern, in which information collection and physical coercion were institutionally distinguished, is the case against which the lockstep critique has the most bite (Greitens 2016 on coercive-institution variation; Slater 2010 on Southeast Asian authoritarian institutions also describes organizational variation across cases). The implication for reading the model is that the conditional structure of Proposition 3 versus Proposition 4 is most relevant where $\pi$ and $q$ are operated by separate organs and least relevant where they are jointly operated. This reading honors the model's own scope: the lockstep is a tractability choice with a definable empirical referent rather than a universal claim.

The magnitude of $\omega_E^*-\omega^*$ in Proposition 3 is bounded only by $\omega_{\max}-\underline\omega$. When $\omega_{\max}\in(\hat\omega_E,\hat\omega]$ and $\omega_{\max}$ is close to $\hat\omega$, the optimum without elections is $\underline\omega$, and the optimum with elections can be as high as $\omega_{\max}$. The model is silent on the magnitude of the headline shift in optimal repression; depending on parameters, the shift could be from "minimally repressive" all the way to "maximally repressive feasible." Whether such large shifts are empirically plausible is not addressed.

Online Appendix A's robustness (repressiveness as the cost of challenging) preserves the ruler-side equilibrium of Proposition 1 but generates strictly higher opposition challenge frequency. The two formulations are observationally distinct: the rate at which opposition challenges occur differs between the main model and Appendix A, even when the ruler's repressiveness choice is identical. Empirical work that maps challenge frequency to model parameters has to choose between formulations.

Online Appendix B's private-signal extension converges to the baseline as $\lambda\to 1$. For $\lambda<1$, the equilibrium has a four-region structure with mixed strategies in the "moderately low" $\omega$ region; the proof relies on a D1-type belief refinement and on an implicit ordering of the analogue thresholds $\underline\omega_\lambda$ and $\bar\omega_\lambda$. The replication confirms the convergence and the four-region structure; the implicit threshold ordering is parallel to the main-text Lemma 1 logic and not load-bearing.

The replication does not engage the broader empirical literature on whether autocracies that hold elections do invest more in repressive capacity. Existing work on competitive and electoral authoritarianism (Levitsky and Way 2010, 2022; Geddes, Wright, and Frantz 2014, 2018; Svolik 2012) provides candidate observables and a comparative basis for that question, but mapping the model's $\omega^*$ to those observables is itself a nontrivial measurement project. Treisman's and others' work on informational autocracy (Guriev and Treisman 2020, 2022) is the closest empirical companion; whether its propaganda-spending and repression-spending series can be read as separate proxies for $q$ and $\pi$ is an open question.

## 8. Conclusion

The Gehlbach et al. (2025) model is correct as stated. Twelve formal claims, three lemmas, and two online-appendix extensions all survive independent re-derivation. The substantive content of the paper is sharpened, not refuted, by independent verification. Three first-order points emerge.

The single-parameter representation of repressiveness binds two channels (mobilization cost and information friction) that empirically need not move together. The conditional structure of the headline is a feature of this lockstep. The original is aware of the simplification — Online Appendix B's intelligence-quality parameter $\lambda$ is itself a partial decoupling — and the proposed $(\omega^c,\omega^s)$ separation is in spirit a further step along the same direction. A two-parameter generalization with proved comparative statics is a research agenda for follow-up theory work; the present paper does not derive it.

The empirical scope of the lockstep critique tracks the organizational form of the coercive apparatus. In modal contemporary autocracies the same agency typically operates both channels, and the lockstep representation is closer to the case than a clean separation; in regimes with structurally distinguished surveillance and mobilization organs the critique has more bite. Reading the conditional structure as a substantive prediction for any specific autocracy therefore requires checking the organizational form, not just the level of repression.

The headline direction (elections raise optimal repression in the regime where they bind) is the more robust object: a single-instance worked example illustrates that the direction can be reached without the lockstep. The conditional (when the channels complement versus substitute) is the more sensitive object. The contribution of an independent re-derivation is to make both claims visible alongside the verification grid: the math is correct; the headline direction is a generic property of "add an information channel" arguments; the conditional is a property of one modeling commitment whose empirical applicability tracks organizational form.

## Appendix A: Replication package

**Full replication package (zip, 72 KB):** [https://www.dropbox.com/scl/fi/iq0mm43pdlmslutnlsvvj/paper-2026-0011-replication-20260428-0716.zip?rlkey=sjsejs2rugoga3psvkl0e2xuj&dl=1](https://www.dropbox.com/scl/fi/iq0mm43pdlmslutnlsvvj/paper-2026-0011-replication-20260428-0716.zip?rlkey=sjsejs2rugoga3psvkl0e2xuj&dl=1)

The package contains: the manuscript (`paper.md`), the verification report (`env/verification.md`), the three independent checker reports (algebra / logic / notation-plausibility), the zero-context blind-rebuild artifact (`env/blind-rebuild.md`), the source briefing (`env/blind-briefing.md`), the formal-content extraction (`env/formal-extract.md`), the claim index (`env/claim-index.yml`), the source manifest with MD5 checksums (`env/manifest.yml`), the simulated 3-panel review (`revision/review/2026-04-28_paper-2026-0011.md`), and a `README_PACKAGE.md` describing layout and reproduction. The original Gehlbach et al. (2025) PDF and Online Appendix are excluded from the zip; they are canonical at the Wiley OA URL and at the corresponding-author website.

## References

Acemoglu, Daron, Simon Johnson, and James A. Robinson. 2012. "The Colonial Origins of Comparative Development: An Empirical Investigation: Reply." *American Economic Review* 102(6): 3077–3110.

Bertrand, Marianne, and Sendhil Mullainathan. 2004. "Are Emily and Greg More Employable Than Lakisha and Jamal? A Field Experiment on Labor Market Discrimination." *American Economic Review* 94(4): 991–1013.

Bueno de Mesquita, Ethan. 2010. "Regime Change and Revolutionary Entrepreneurs." *American Political Science Review* 104(3): 446–466.

Bueno de Mesquita, Ethan, David Myatt, Alastair Smith, and Scott Tyson. 2024. "The Punisher's Dilemma." *Journal of Politics* (advance online).

Bueno de Mesquita, Ethan, and Mehdi Shadmehr. 2023. "Persuading the Principled." *American Political Science Review* 117(4): 1428–1446.

Di Lonardo, Livio, Jessica Sun, and Scott Tyson. 2020. "Autocratic Stability in the Shadow of Foreign Threats." *American Political Science Review* 114(4): 1247–1265.

Egorov, Georgy, and Konstantin Sonin. 2021. "The Political Economics of Non-Democracy." *Journal of Economic Literature* (forthcoming, working version).

Egorov, Georgy, and Konstantin Sonin. 2024. "The Political Economics of Non-Democracy." *Journal of Economic Literature* 62(2): 547–593.

Frye, Timothy. 2021. *Weak Strongman: The Limits of Power in Putin's Russia*. Princeton, NJ: Princeton University Press.

Geddes, Barbara, Joseph Wright, and Erica Frantz. 2014. "Autocratic Breakdown and Regime Transitions: A New Data Set." *Perspectives on Politics* 12(2): 313–331.

Geddes, Barbara, Joseph Wright, and Erica Frantz. 2018. *How Dictatorships Work: Power, Personalization, and Collapse*. Cambridge: Cambridge University Press.

Gehlbach, Scott, Zhaotian Luo, Anton Shirikov, and Dmitriy Vorobyev. 2025. "Is there really a dictator's dilemma? Information and repression in autocracy." *American Journal of Political Science* 70(1): 381–395.

Gehlbach, Scott, and Alberto Simpser. 2015. "Electoral Manipulation as Bureaucratic Control." *American Journal of Political Science* 59(1): 212–224.

Gehlbach, Scott, and Konstantin Sonin. 2014. "Government Control of the Media." *Journal of Public Economics* 118: 163–171.

Gitmez, A. Arda, and Konstantin Sonin. 2023. "The Dictator's Dilemma" (working paper).

Greitens, Sheena Chestnut. 2016. *Dictators and Their Secret Police: Coercive Institutions and State Violence*. Cambridge: Cambridge University Press.

Guriev, Sergei, and Daniel Treisman. 2020. "A Theory of Informational Autocracy." *Journal of Public Economics* 186: 104158.

Guriev, Sergei, and Daniel Treisman. 2022. *Spin Dictators: The Changing Face of Tyranny in the 21st Century*. Princeton, NJ: Princeton University Press.

Kamenica, Emir, and Matthew Gentzkow. 2011. "Bayesian Persuasion." *American Economic Review* 101(6): 2590–2615.

Levitsky, Steven, and Lucan A. Way. 2010. *Competitive Authoritarianism: Hybrid Regimes after the Cold War*. Cambridge: Cambridge University Press.

Levitsky, Steven, and Lucan A. Way. 2022. *Revolution and Dictatorship: The Violent Origins of Durable Authoritarianism*. Princeton, NJ: Princeton University Press.

Little, Andrew T. 2017. "Propaganda and Credulity." *Journal of Theoretical Politics* (working version) / *Games and Economic Behavior* 102: 224–232.

Luo, Zhaotian, and Arturas Rozenas. 2018a. "Strategies of Election Rigging: Trade-Offs, Determinants, and Consequences." *American Journal of Political Science* (working title; see also QJPS 2018b).

Luo, Zhaotian, and Arturas Rozenas. 2018b. "The Election Monitor's Curse." *Quarterly Journal of Political Science* 13(4): 401–429.

Shadmehr, Mehdi, and Dan Bernhardt. 2011. "Collective Action with Uncertain Payoffs: Coordination, Public Signals, and Punishment Dilemmas." *American Political Science Review* 105(4): 829–851.

Slater, Dan. 2010. *Ordering Power: Contentious Politics and Authoritarian Leviathans in Southeast Asia*. Cambridge: Cambridge University Press.

Svolik, Milan W. 2012. *The Politics of Authoritarian Rule*. Cambridge: Cambridge University Press.

Tyson, Scott A. 2018. "The Agency Problem Underlying Repression." *Journal of Politics* 80(4): 1297–1310.

Tyson, Scott A., and Alastair Smith. 2018. "Dual-Layered Coordination and Political Instability: Repression, Co-optation, and the Role of Information." *Journal of Politics* 80(1): 44–58.

Wintrobe, Ronald. 1998. *The Political Economy of Dictatorship*. Cambridge: Cambridge University Press.
