import{_ as s,c as n,o as a,d as l}from"./app.ced819ec.js";var p="/iroha-2-docs/assets/sample-vue-app.4caffed6.gif";const g='{"title":"JavaScript / TypeScript guide","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. Client Installation","slug":"_1-client-installation"},{"level":2,"title":"2. Client Configuration","slug":"_2-client-configuration"},{"level":2,"title":"3. Registering a Domain","slug":"_3-registering-a-domain"},{"level":2,"title":"4. Registering an Account","slug":"_4-registering-an-account"},{"level":2,"title":"5. Registering and minting assets","slug":"_5-registering-and-minting-assets"},{"level":2,"title":"6. Visualizing outputs","slug":"_6-visualizing-outputs"}],"relativePath":"guide/javascript.md","lastUpdated":1649230251000}',o={},e=l(`<h1 id="javascript-typescript-guide" tabindex="-1">JavaScript / TypeScript guide <a class="header-anchor" href="#javascript-typescript-guide" aria-hidden="true">#</a></h1><div class="info custom-block"><p class="custom-block-title">INFO</p><p>This guide targets <code>@iroha2/client@1.1.0</code> and <code>@iroha/data-model@1.1.0</code>.</p></div><h2 id="_1-client-installation" tabindex="-1">1. Client Installation <a class="header-anchor" href="#_1-client-installation" aria-hidden="true">#</a></h2><p>The Iroha 2 JavaScript library consists of multiple packages:</p><table><thead><tr><th>Package</th><th>Description</th></tr></thead><tbody><tr><td><code>client</code></td><td>Submits requests to Iroha Peer</td></tr><tr><td><code>data-model</code></td><td>Provides <a href="https://github.com/paritytech/parity-scale-codec" target="_blank" rel="noopener noreferrer">SCALE</a> (Simple Concatenated Aggregate Little-Endian)-codecs for the Iroha 2 Data Model</td></tr><tr><td><code>crypto-core</code></td><td>Contains cryptography types</td></tr><tr><td><code>crypto-target-node</code></td><td>Compiled crypto WASM (<a href="https://webassembly.org/" target="_blank" rel="noopener noreferrer">Web Assembly</a>) for the Node.js environment</td></tr><tr><td><code>crypto-target-web</code></td><td>Compiled crypto WASM for native Web (ESM)</td></tr><tr><td><code class="whitespace-pre">crypto-target-bundler</code></td><td>Compiled crypto WASM to use with bundlers such as Webpack</td></tr></tbody></table><p>All of the are published under scope <code>@iroha2</code> into Iroha Nexus Registry. In future, they will be published in the main NPM Registry. To install these packages, firstly you need to setup a registry:</p><div class="language-ini"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#6E7781;"># FILE: .npmrc</span></span>
<span class="line"><span style="color:#24292F;">@iroha2:</span><span style="color:#CF222E;">registry</span><span style="color:#24292F;">=https://nexus.iroha.tech/repository/npm-group/</span></span>
<span class="line"></span></code></pre></div><p>Then you can install these packages as any other NPM package:</p><div class="language-bash"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#24292F;">npm i @iroha2/client</span></span>
<span class="line"><span style="color:#24292F;">yarn add @iroha2/data-model</span></span>
<span class="line"><span style="color:#24292F;">pnpm add @iroha2/crypto-target-web</span></span>
<span class="line"></span></code></pre></div><p>The set of packages that you need to install depends on your intention. Maybe you only need to play with the Data Model to perform (de-)serialisation, in which case the <code>data-model</code> package is enough. Maybe you only need to check on a peer in terms of status/health, thus need only the client library, because this API doesn&#39;t require any interactions with crypto or Data Model. For the purposes of this tutorial, it\u2019s better to install everything, however, in general the packages are maximally decoupled, so you can minimise the footprint.</p><p>Moving on, if you are planning to use the Transaction or Query API, you\u2019ll also need to inject an appropriate <code>crypto</code> instance into the client at runtime. This has to be adjusted depending on your particular environment. For example, for Node.js users, such an injection may look like the following:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { crypto } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/crypto-target-node&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { setCrypto } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8250DF;">setCrypto</span><span style="color:#24292F;">(crypto)</span></span>
<span class="line"></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Please refer to the related <code>@iroha2/crypto-target-*</code> package documentation because it may require some specific configuration. For example, the <code>web</code> target requires to call an asynchronous <code>init()</code> function before usage of <code>crypto</code>.</p></div><h2 id="_2-client-configuration" tabindex="-1">2. Client Configuration <a class="header-anchor" href="#_2-client-configuration" aria-hidden="true">#</a></h2><p>The JavaScript Client is fairly low-level in the sense that it doesn\u2019t expose any convenience features like a <code>TransactionBuilder</code> or a <code>ConfigBuilder</code>. Work on implementing those is underway, and these features will very likely be available with the second round of this tutorial\u2019s release. Thus, on the plus side: configuration of the client is simple, on the downside you have to prepare a lot manually.</p><p>A basic client setup looks straightforward:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { Client } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">client</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">Client</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">  torii: {</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#6E7781;">// Both URLs are optional - in case you need only a part of endpoints,</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#6E7781;">// e.g. only Telemetry ones</span></span>
<span class="line"><span style="color:#24292F;">    apiURL: </span><span style="color:#0A3069;">&#39;http://127.0.0.1:8080&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">    telemetryURL: </span><span style="color:#0A3069;">&#39;http://127.0.0.1:8081&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  },</span></span>
<span class="line"><span style="color:#24292F;">})</span></span>
<span class="line"></span></code></pre></div><p>That&#39;s enough to perform health or status check, but if you need to use transactions or queries, you\u2019ll need to prepare a key pair.</p><p>Let&#39;s assume that you have stringified public &amp; private keys (more on that later). Thus, a key-pair generation could look like this:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { crypto } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/crypto-target-node&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { KeyPair } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/crypto-core&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;">// just some package for hex-bytes transform</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { hexToBytes } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;hada&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">function</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">generateKeyPair</span><span style="color:#24292F;">(</span><span style="color:#953800;">params</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#953800;">publicKeyMultihash</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#953800;">privateKey</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#953800;">digestFunction</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#953800;">payload</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span></span>
<span class="line"><span style="color:#24292F;">  }</span></span>
<span class="line"><span style="color:#24292F;">})</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#953800;">KeyPair</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">multihashBytes</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Uint8Array</span><span style="color:#24292F;">.</span><span style="color:#8250DF;">from</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#8250DF;">hexToBytes</span><span style="color:#24292F;">(params.publicKeyMultihash),</span></span>
<span class="line"><span style="color:#24292F;">  )</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">multihash</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> crypto.</span><span style="color:#8250DF;">createMultihashFromBytes</span><span style="color:#24292F;">(multihashBytes)</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">publicKey</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> crypto.</span><span style="color:#8250DF;">createPublicKeyFromMultihash</span><span style="color:#24292F;">(multihash)</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">privateKey</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> crypto.</span><span style="color:#8250DF;">createPrivateKeyFromJsKey</span><span style="color:#24292F;">(params.privateKey)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">keyPair</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> crypto.</span><span style="color:#8250DF;">createKeyPairFromKeys</span><span style="color:#24292F;">(publicKey, privateKey)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#6E7781;">// don&#39;t forget to &quot;free&quot; created structures</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">for</span><span style="color:#24292F;"> (</span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">x</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">of</span><span style="color:#24292F;"> [publicKey, privateKey, multihash]) {</span></span>
<span class="line"><span style="color:#24292F;">    x.</span><span style="color:#8250DF;">free</span><span style="color:#24292F;">()</span></span>
<span class="line"><span style="color:#24292F;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">return</span><span style="color:#24292F;"> keyPair</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">kp</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">generateKeyPair</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">  publicKeyMultihash:</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#0A3069;">&#39;ed0120e555d194e8822da35ac541ce9eec8b45058f4d294d9426ef97ba92698766f7d3&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  privateKey: {</span></span>
<span class="line"><span style="color:#24292F;">    digestFunction: </span><span style="color:#0A3069;">&#39;ed25519&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">    payload:</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#0A3069;">&#39;de757bcb79f4c63e8fa0795edc26f86dfdba189b846e903d0b732bb644607720e555d194e8822da35ac541ce9eec8b45058f4d294d9426ef97ba92698766f7d3&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  },</span></span>
<span class="line"><span style="color:#24292F;">})</span></span>
<span class="line"></span></code></pre></div><h2 id="_3-registering-a-domain" tabindex="-1">3. Registering a Domain <a class="header-anchor" href="#_3-registering-a-domain" aria-hidden="true">#</a></h2><p>Here we see how similar the JavaScript code is to the Rust counterpart. It should be emphasised that the JavaScript library is a thin wrapper: It doesn\u2019t provide any special builder structures, meaning you have to work with bare-bones compiled Data Model structures and define all internal fields explicitly. Doubly so, since JavaScript employs many implicit conversions, we highly recommend that you employ TypeScript. This makes many errors far easier to debug, but unfortunately results in more boilerplate.</p><p>Let\u2019s register a new domain with the name <code>looking_glass</code> our current account: <em>alice@wondeland</em>.</p><p>First, we need to import necessary models and a pre-configured client instance:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { Client } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/client&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  RegisterBox,</span></span>
<span class="line"><span style="color:#24292F;">  EvaluatesToIdentifiableBox,</span></span>
<span class="line"><span style="color:#24292F;">  Expression,</span></span>
<span class="line"><span style="color:#24292F;">  Value,</span></span>
<span class="line"><span style="color:#24292F;">  IdentifiableBox,</span></span>
<span class="line"><span style="color:#24292F;">  Domain,</span></span>
<span class="line"><span style="color:#24292F;">  DomainId,</span></span>
<span class="line"><span style="color:#24292F;">  BTreeMapAccountIdAccount,</span></span>
<span class="line"><span style="color:#24292F;">  Metadata,</span></span>
<span class="line"><span style="color:#24292F;">  BTreeMapNameValue,</span></span>
<span class="line"><span style="color:#24292F;">  BTreeMapAssetDefinitionIdAssetDefinitionEntry,</span></span>
<span class="line"><span style="color:#24292F;">  OptionIpfsPath,</span></span>
<span class="line"><span style="color:#24292F;">  Executable,</span></span>
<span class="line"><span style="color:#24292F;">  VecInstruction,</span></span>
<span class="line"><span style="color:#24292F;">  Instruction,</span></span>
<span class="line"><span style="color:#24292F;">  QueryBox,</span></span>
<span class="line"><span style="color:#24292F;">} </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;">/* --snip-- */</span></span>
<span class="line"><span style="color:#CF222E;">declare</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">client</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#953800;">Client</span></span>
<span class="line"></span></code></pre></div><p>To register a new domain, we need to submit a transaction with one instruction: to register a new domain. Let\u2019s wrap it all in an async function:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">async</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">function</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">registerDomain</span><span style="color:#24292F;">(</span><span style="color:#953800;">domainName</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span><span style="color:#24292F;">) {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">registerBox</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">RegisterBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">    object: </span><span style="color:#8250DF;">EvaluatesToIdentifiableBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">      expression: </span><span style="color:#8250DF;">Expression</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#0A3069;">&#39;Raw&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#8250DF;">Value</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#0A3069;">&#39;Identifiable&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#8250DF;">IdentifiableBox</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">            </span><span style="color:#0A3069;">&#39;Domain&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">            </span><span style="color:#8250DF;">Domain</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">              id: </span><span style="color:#8250DF;">DomainId</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">                name: domainName,</span></span>
<span class="line"><span style="color:#24292F;">              }),</span></span>
<span class="line"><span style="color:#24292F;">              accounts: </span><span style="color:#8250DF;">BTreeMapAccountIdAccount</span><span style="color:#24292F;">(</span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Map</span><span style="color:#24292F;">()),</span></span>
<span class="line"><span style="color:#24292F;">              metadata: </span><span style="color:#8250DF;">Metadata</span><span style="color:#24292F;">({ map: </span><span style="color:#8250DF;">BTreeMapNameValue</span><span style="color:#24292F;">(</span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Map</span><span style="color:#24292F;">()) }),</span></span>
<span class="line"><span style="color:#24292F;">              asset_definitions:</span></span>
<span class="line"><span style="color:#24292F;">                </span><span style="color:#8250DF;">BTreeMapAssetDefinitionIdAssetDefinitionEntry</span><span style="color:#24292F;">(</span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Map</span><span style="color:#24292F;">()),</span></span>
<span class="line"><span style="color:#24292F;">              logo: </span><span style="color:#8250DF;">OptionIpfsPath</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;None&#39;</span><span style="color:#24292F;">),</span></span>
<span class="line"><span style="color:#24292F;">            }),</span></span>
<span class="line"><span style="color:#24292F;">          ),</span></span>
<span class="line"><span style="color:#24292F;">        ),</span></span>
<span class="line"><span style="color:#24292F;">      ),</span></span>
<span class="line"><span style="color:#24292F;">    }),</span></span>
<span class="line"><span style="color:#24292F;">  })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">await</span><span style="color:#24292F;"> client.</span><span style="color:#8250DF;">submit</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#8250DF;">Executable</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#0A3069;">&#39;Instructions&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#8250DF;">VecInstruction</span><span style="color:#24292F;">([</span><span style="color:#8250DF;">Instruction</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Register&#39;</span><span style="color:#24292F;">, registerBox)]),</span></span>
<span class="line"><span style="color:#24292F;">    ),</span></span>
<span class="line"><span style="color:#24292F;">  )</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"></span></code></pre></div><p>Which we use to register the domain like so:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">await</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">registerDomain</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;looking_glass&#39;</span><span style="color:#24292F;">)</span></span>
<span class="line"></span></code></pre></div><p>We can also ensure that new domain is created using Query API. Let\u2019s create another function that wraps that functionality:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">async</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">function</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">ensureDomainExistence</span><span style="color:#24292F;">(</span><span style="color:#953800;">domainName</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span><span style="color:#24292F;">) {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">result</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">await</span><span style="color:#24292F;"> client.</span><span style="color:#8250DF;">request</span><span style="color:#24292F;">(</span><span style="color:#8250DF;">QueryBox</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;FindAllDomains&#39;</span><span style="color:#24292F;">, </span><span style="color:#0550AE;">null</span><span style="color:#24292F;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">domain</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> result</span></span>
<span class="line"><span style="color:#24292F;">    .</span><span style="color:#8250DF;">as</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Ok&#39;</span><span style="color:#24292F;">)</span></span>
<span class="line"><span style="color:#24292F;">    .</span><span style="color:#8250DF;">as</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Vec&#39;</span><span style="color:#24292F;">)</span></span>
<span class="line"><span style="color:#24292F;">    .</span><span style="color:#8250DF;">map</span><span style="color:#24292F;">((</span><span style="color:#953800;">x</span><span style="color:#24292F;">) </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> x.</span><span style="color:#8250DF;">as</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Identifiable&#39;</span><span style="color:#24292F;">).</span><span style="color:#8250DF;">as</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Domain&#39;</span><span style="color:#24292F;">))</span></span>
<span class="line"><span style="color:#24292F;">    .</span><span style="color:#8250DF;">find</span><span style="color:#24292F;">((</span><span style="color:#953800;">x</span><span style="color:#24292F;">) </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> x.id.name </span><span style="color:#CF222E;">===</span><span style="color:#24292F;"> domainName)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">if</span><span style="color:#24292F;"> (</span><span style="color:#CF222E;">!</span><span style="color:#24292F;">domain) </span><span style="color:#CF222E;">throw</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Error</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Not found&#39;</span><span style="color:#24292F;">)</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"></span></code></pre></div><p>Now you can ensure that domain is created by calling:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">await</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">ensureDomainExistence</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;looking_glass&#39;</span><span style="color:#24292F;">)</span></span>
<span class="line"></span></code></pre></div><h2 id="_4-registering-an-account" tabindex="-1">4. Registering an Account <a class="header-anchor" href="#_4-registering-an-account" aria-hidden="true">#</a></h2><p>Registering an account is a bit more involved than registering a domain. With a domain, the only concern is the domain name, however, with an account, there are a few more things to worry about.</p><p>First of all, we need to create an <code>AccountId</code>. Note that we can only register an account to an existing domain. The best UX design practices dictate that you should check if the requested domain exists <em>now</em>, and if it doesn\u2019t \u2014 suggest a fix to the user. After that, we can create a new account, that we name <em>white_rabbit</em>.</p><p>Imports we need:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  AccountId,</span></span>
<span class="line"><span style="color:#24292F;">  DomainId,</span></span>
<span class="line"><span style="color:#24292F;">  PublicKey,</span></span>
<span class="line"><span style="color:#24292F;">  RegisterBox,</span></span>
<span class="line"><span style="color:#24292F;">  Expression,</span></span>
<span class="line"><span style="color:#24292F;">  Value,</span></span>
<span class="line"><span style="color:#24292F;">  IdentifiableBox,</span></span>
<span class="line"><span style="color:#24292F;">  EvaluatesToIdentifiableBox,</span></span>
<span class="line"><span style="color:#24292F;">  Metadata,</span></span>
<span class="line"><span style="color:#24292F;">  NewAccount,</span></span>
<span class="line"><span style="color:#24292F;">  VecPublicKey,</span></span>
<span class="line"><span style="color:#24292F;">  BTreeMapNameValue,</span></span>
<span class="line"><span style="color:#24292F;">} </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span></code></pre></div><p><code>AccountId</code> structure:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">accountId</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">AccountId</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">  name: </span><span style="color:#0A3069;">&#39;white_rabbit&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  domain_id: </span><span style="color:#8250DF;">DomainId</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">    name: </span><span style="color:#0A3069;">&#39;looking_glass&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  }),</span></span>
<span class="line"><span style="color:#24292F;">})</span></span>
<span class="line"></span></code></pre></div><p>Second, you should provide the account with a public key. It is tempting to generate both it and the private key at this time, but it isn&#39;t the brightest idea. Remember, that <em>the white_rabbit</em> trusts <em>you, alice@wonderland,</em> to create an account for them in the domain <em>looking_glass, <strong>but doesn&#39;t want you to have access to that account after creation</strong>.</em> If you gave <em>white_rabbit</em> a key that you generated yourself, how would they know if you don&#39;t have a copy of their private key? Instead, the best way is to <strong>ask</strong> <em>white_rabbit</em> to generate a new key-pair, and give you the public half of it.</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">key</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">PublicKey</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">  payload: </span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Uint8Array</span><span style="color:#24292F;">([</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#6E7781;">/* put bytes here */</span></span>
<span class="line"><span style="color:#24292F;">  ]),</span></span>
<span class="line"><span style="color:#24292F;">  digest_function: </span><span style="color:#0A3069;">&#39;some_digest&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">})</span></span>
<span class="line"></span></code></pre></div><p>Only then do we build an instruction from it:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">registerAccountInstruction</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">RegisterBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">  object: </span><span style="color:#8250DF;">EvaluatesToIdentifiableBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">    expression: </span><span style="color:#8250DF;">Expression</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#0A3069;">&#39;Raw&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#8250DF;">Value</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#0A3069;">&#39;Identifiable&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#8250DF;">IdentifiableBox</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#0A3069;">&#39;NewAccount&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#8250DF;">NewAccount</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">            id: accountId,</span></span>
<span class="line"><span style="color:#24292F;">            signatories: </span><span style="color:#8250DF;">VecPublicKey</span><span style="color:#24292F;">([key]),</span></span>
<span class="line"><span style="color:#24292F;">            metadata: </span><span style="color:#8250DF;">Metadata</span><span style="color:#24292F;">({ map: </span><span style="color:#8250DF;">BTreeMapNameValue</span><span style="color:#24292F;">(</span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Map</span><span style="color:#24292F;">()) }),</span></span>
<span class="line"><span style="color:#24292F;">          }),</span></span>
<span class="line"><span style="color:#24292F;">        ),</span></span>
<span class="line"><span style="color:#24292F;">      ),</span></span>
<span class="line"><span style="color:#24292F;">    ),</span></span>
<span class="line"><span style="color:#24292F;">  }),</span></span>
<span class="line"><span style="color:#24292F;">})</span></span>
<span class="line"></span></code></pre></div><p>Which is then wrapped in a transaction and submitted to the peer as in the previous section.</p><h2 id="_5-registering-and-minting-assets" tabindex="-1">5. Registering and minting assets <a class="header-anchor" href="#_5-registering-and-minting-assets" aria-hidden="true">#</a></h2><p>Now we must talk a little about assets. Iroha has been built with few underlying assumptions about what the assets need to be. The assets can be fungible (every \xA31 is exactly the same as every other \xA31), or non-fungible (a \xA31 bill signed by the Queen of Hearts is not the same as a \xA31 bill signed by the King of Spades), mintable (you can make more of them) and non-mintable (you can only specify their initial quantity in the genesis block). Additionally, the assets have different underlying value types.</p><p>Specifically, we have <code>AssetValueType::Quantity</code> which is effectively an unsigned 32-bit integer, a <code>BigQuantity</code> that is an unsigned 128-bit integer, which is enough to trade all possible IPV6 addresses, and quite possibly individual grains of sand on the surface of the earth, as well as <code>Fixed</code>, which is a positive (though signed) 64-bit fixed-precision number with nine significant digits after the decimal point. It doesn&#39;t quite use binary-coded decimals for performance reasons. All three types can be registered as either <strong>mintable</strong> or <strong>non-mintable</strong>.</p><p>In JS, you can create a new asset with the following construction:</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  AssetDefinition,</span></span>
<span class="line"><span style="color:#24292F;">  AssetValueType,</span></span>
<span class="line"><span style="color:#24292F;">  AssetDefinitionId,</span></span>
<span class="line"><span style="color:#24292F;">  DomainId,</span></span>
<span class="line"><span style="color:#24292F;">  Metadata,</span></span>
<span class="line"><span style="color:#24292F;">  BTreeMapNameValue,</span></span>
<span class="line"><span style="color:#24292F;">  RegisterBox,</span></span>
<span class="line"><span style="color:#24292F;">  EvaluatesToIdentifiableBox,</span></span>
<span class="line"><span style="color:#24292F;">  Expression,</span></span>
<span class="line"><span style="color:#24292F;">  Value,</span></span>
<span class="line"><span style="color:#24292F;">  IdentifiableBox,</span></span>
<span class="line"><span style="color:#24292F;">  Instruction,</span></span>
<span class="line"><span style="color:#24292F;">} </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">time</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">AssetDefinition</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">  value_type: </span><span style="color:#8250DF;">AssetValueType</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Quantity&#39;</span><span style="color:#24292F;">),</span></span>
<span class="line"><span style="color:#24292F;">  id: </span><span style="color:#8250DF;">AssetDefinitionId</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">    name: </span><span style="color:#0A3069;">&#39;time&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">    domain_id: </span><span style="color:#8250DF;">DomainId</span><span style="color:#24292F;">({ name: </span><span style="color:#0A3069;">&#39;looking_glass&#39;</span><span style="color:#24292F;"> }),</span></span>
<span class="line"><span style="color:#24292F;">  }),</span></span>
<span class="line"><span style="color:#24292F;">  metadata: </span><span style="color:#8250DF;">Metadata</span><span style="color:#24292F;">({ map: </span><span style="color:#8250DF;">BTreeMapNameValue</span><span style="color:#24292F;">(</span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Map</span><span style="color:#24292F;">()) }),</span></span>
<span class="line"><span style="color:#24292F;">  mintable: </span><span style="color:#0550AE;">false</span><span style="color:#24292F;">, </span><span style="color:#6E7781;">// If only we could mint more time.</span></span>
<span class="line"><span style="color:#24292F;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">register</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">Instruction</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0A3069;">&#39;Register&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#8250DF;">RegisterBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">    object: </span><span style="color:#8250DF;">EvaluatesToIdentifiableBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">      expression: </span><span style="color:#8250DF;">Expression</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#0A3069;">&#39;Raw&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#8250DF;">Value</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Identifiable&#39;</span><span style="color:#24292F;">, </span><span style="color:#8250DF;">IdentifiableBox</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;AssetDefinition&#39;</span><span style="color:#24292F;">, time)),</span></span>
<span class="line"><span style="color:#24292F;">      ),</span></span>
<span class="line"><span style="color:#24292F;">    }),</span></span>
<span class="line"><span style="color:#24292F;">  }),</span></span>
<span class="line"><span style="color:#24292F;">)</span></span>
<span class="line"></span></code></pre></div><p>Pay attention to the fact that we have defined the asset as <code>mintable: false</code>. What this means is that we cannot create more of <code>time</code>. The late bunny will always be late, because even the super-user of the blockchain cannot mint more of <code>time</code> than already exists in the genesis block.</p><p>This means that no matter how hard the <em>white_rabbit</em> tries, the time that he has is the time that was given to him at genesis. And since we haven\u2019t defined any time in the domain <em>looking_glass at</em> genesis and defined time in a non-mintable fashion afterwards, the <em>white_rabbit</em> is doomed to always be late.</p><p>We can however mint a pre-existing <code>mintable: true</code> asset that belongs to Alice.</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  Instruction,</span></span>
<span class="line"><span style="color:#24292F;">  MintBox,</span></span>
<span class="line"><span style="color:#24292F;">  EvaluatesToValue,</span></span>
<span class="line"><span style="color:#24292F;">  Expression,</span></span>
<span class="line"><span style="color:#24292F;">  Value,</span></span>
<span class="line"><span style="color:#24292F;">  EvaluatesToIdBox,</span></span>
<span class="line"><span style="color:#24292F;">  IdBox,</span></span>
<span class="line"><span style="color:#24292F;">  AssetDefinitionId,</span></span>
<span class="line"><span style="color:#24292F;">  DomainId,</span></span>
<span class="line"><span style="color:#24292F;">} </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">mint</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">Instruction</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0A3069;">&#39;Mint&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#8250DF;">MintBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">    object: </span><span style="color:#8250DF;">EvaluatesToValue</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">      expression: </span><span style="color:#8250DF;">Expression</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Raw&#39;</span><span style="color:#24292F;">, </span><span style="color:#8250DF;">Value</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;U32&#39;</span><span style="color:#24292F;">, </span><span style="color:#0550AE;">42</span><span style="color:#24292F;">)),</span></span>
<span class="line"><span style="color:#24292F;">    }),</span></span>
<span class="line"><span style="color:#24292F;">    destination_id: </span><span style="color:#8250DF;">EvaluatesToIdBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">      expression: </span><span style="color:#8250DF;">Expression</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#0A3069;">&#39;Raw&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#8250DF;">Value</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#0A3069;">&#39;Id&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#8250DF;">IdBox</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">            </span><span style="color:#0A3069;">&#39;AssetDefinitionId&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">            </span><span style="color:#8250DF;">AssetDefinitionId</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">              name: </span><span style="color:#0A3069;">&#39;roses&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">              domain_id: </span><span style="color:#8250DF;">DomainId</span><span style="color:#24292F;">({ name: </span><span style="color:#0A3069;">&#39;wonderland&#39;</span><span style="color:#24292F;"> }),</span></span>
<span class="line"><span style="color:#24292F;">            }),</span></span>
<span class="line"><span style="color:#24292F;">          ),</span></span>
<span class="line"><span style="color:#24292F;">        ),</span></span>
<span class="line"><span style="color:#24292F;">      ),</span></span>
<span class="line"><span style="color:#24292F;">    }),</span></span>
<span class="line"><span style="color:#24292F;">  }),</span></span>
<span class="line"><span style="color:#24292F;">)</span></span>
<span class="line"></span></code></pre></div><p>Again it should be emphasised that an Iroha 2 network is strongly typed. You need to take special care to make sure that only unsigned integers are passed to the <code>Value.variantsUnwrapped.U32</code> factory method. Fixed precision values also need to be taken into consideration. Any attempt to add to or subtract from a negative Fixed-precision value will result in an error.</p><h2 id="_6-visualizing-outputs" tabindex="-1">6. Visualizing outputs <a class="header-anchor" href="#_6-visualizing-outputs" aria-hidden="true">#</a></h2><p>Finally, we should talk about visualising data. The Rust API is currently the most complete in terms of available queries and instructions. After all, this is the language in which Iroha 2 was built.</p><p>Let&#39;s build a small Vue 3 application that uses each API we&#39;ve discovered in this guide!</p><p>Our app will consist of 3 main views:</p><ul><li>Status checker, that periodically requests peer status (e.g. current blocks height) and shows it;</li><li>Domain creator, which is a form to create a new domain with specified name</li><li>Listener, that has a toggle to setup listening for events</li></ul><p>Our client config is the following (<code>config.json</code> file in the project):</p><div class="language-json"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#24292F;">{</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0550AE;">&quot;torii&quot;</span><span style="color:#24292F;">: {</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#0550AE;">&quot;apiURL&quot;</span><span style="color:#24292F;">: </span><span style="color:#0A3069;">&quot;http://127.0.0.1:8080&quot;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#0550AE;">&quot;telemetryURL&quot;</span><span style="color:#24292F;">: </span><span style="color:#0A3069;">&quot;http://127.0.0.1:8081&quot;</span></span>
<span class="line"><span style="color:#24292F;">  },</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0550AE;">&quot;account&quot;</span><span style="color:#24292F;">: {</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#0550AE;">&quot;name&quot;</span><span style="color:#24292F;">: </span><span style="color:#0A3069;">&quot;alice&quot;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#0550AE;">&quot;domain_id&quot;</span><span style="color:#24292F;">: {</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#0550AE;">&quot;name&quot;</span><span style="color:#24292F;">: </span><span style="color:#0A3069;">&quot;wonderland&quot;</span></span>
<span class="line"><span style="color:#24292F;">    }</span></span>
<span class="line"><span style="color:#24292F;">  },</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0550AE;">&quot;publicKey&quot;</span><span style="color:#24292F;">: </span><span style="color:#0A3069;">&quot;ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0&quot;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0550AE;">&quot;privateKey&quot;</span><span style="color:#24292F;">: {</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#0550AE;">&quot;digestFunction&quot;</span><span style="color:#24292F;">: </span><span style="color:#0A3069;">&quot;ed25519&quot;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#0550AE;">&quot;payload&quot;</span><span style="color:#24292F;">: </span><span style="color:#0A3069;">&quot;9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0&quot;</span></span>
<span class="line"><span style="color:#24292F;">  }</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Keys here are just some sample keys, as well as account.</p></div><p>To use them all, firstly we need to initialize our client &amp; crypto.</p><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#6E7781;">// FILE: crypto.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { init, crypto } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/crypto-target-web&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;">// using top-level module await</span></span>
<span class="line"><span style="color:#CF222E;">await</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">init</span><span style="color:#24292F;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">export</span><span style="color:#24292F;"> { crypto }</span></span>
<span class="line"></span></code></pre></div><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#6E7781;">// FILE: client.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { Client, setCrypto } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/client&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { KeyPair } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/crypto-core&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { hexToBytes } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;hada&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { AccountId } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;">// importing already initialized crypto</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { crypto } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;./crypto&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;">// just a config with stringified keys</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> client_config </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;./config&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8250DF;">setCrypto</span><span style="color:#24292F;">(crypto)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">export</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">client</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">Client</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">  torii: {</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#6E7781;">// these ports are specified in the peer&#39;s own config</span></span>
<span class="line"><span style="color:#24292F;">    apiURL: </span><span style="color:#0A3069;">\`http://localhost:8080\`</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">    telemetryURL: </span><span style="color:#0A3069;">\`http://localhost:8081\`</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  },</span></span>
<span class="line"><span style="color:#24292F;">  accountId: client_config.account </span><span style="color:#CF222E;">as</span><span style="color:#24292F;"> </span><span style="color:#953800;">AccountId</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  keyPair: </span><span style="color:#8250DF;">generateKeyPair</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">    publicKeyMultihash: client_config.publicKey,</span></span>
<span class="line"><span style="color:#24292F;">    privateKey: client_config.privateKey,</span></span>
<span class="line"><span style="color:#24292F;">  }),</span></span>
<span class="line"><span style="color:#24292F;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6E7781;">// just an util function</span></span>
<span class="line"><span style="color:#CF222E;">function</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">generateKeyPair</span><span style="color:#24292F;">(</span><span style="color:#953800;">params</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#953800;">publicKeyMultihash</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#953800;">privateKey</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#953800;">digestFunction</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#953800;">payload</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span></span>
<span class="line"><span style="color:#24292F;">  }</span></span>
<span class="line"><span style="color:#24292F;">})</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#953800;">KeyPair</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">multihashBytes</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Uint8Array</span><span style="color:#24292F;">.</span><span style="color:#8250DF;">from</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#8250DF;">hexToBytes</span><span style="color:#24292F;">(params.publicKeyMultihash),</span></span>
<span class="line"><span style="color:#24292F;">  )</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">multihash</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> crypto.</span><span style="color:#8250DF;">createMultihashFromBytes</span><span style="color:#24292F;">(multihashBytes)</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">publicKey</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> crypto.</span><span style="color:#8250DF;">createPublicKeyFromMultihash</span><span style="color:#24292F;">(multihash)</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">privateKey</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> crypto.</span><span style="color:#8250DF;">createPrivateKeyFromJsKey</span><span style="color:#24292F;">(params.privateKey)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">keyPair</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> crypto.</span><span style="color:#8250DF;">createKeyPairFromKeys</span><span style="color:#24292F;">(publicKey, privateKey)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">for</span><span style="color:#24292F;"> (</span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">x</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">of</span><span style="color:#24292F;"> [publicKey, privateKey, multihash]) {</span></span>
<span class="line"><span style="color:#24292F;">    x.</span><span style="color:#8250DF;">free</span><span style="color:#24292F;">()</span></span>
<span class="line"><span style="color:#24292F;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">return</span><span style="color:#24292F;"> keyPair</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"></span></code></pre></div><p>Fine, now we are ready to use client. Let&#39;s start from the StatusChecker component:</p><div class="language-vue"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">script</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">setup</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">lang</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;ts&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { useIntervalFn, useAsyncState } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@vueuse/core&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { client } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;../client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> { </span><span style="color:#953800;">state</span><span style="color:#24292F;">: </span><span style="color:#0550AE;">status</span><span style="color:#24292F;">, </span><span style="color:#953800;">execute</span><span style="color:#24292F;">: </span><span style="color:#0550AE;">updateStatus</span><span style="color:#24292F;"> } </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">useAsyncState</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">  () </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> client.</span><span style="color:#8250DF;">getStatus</span><span style="color:#24292F;">(),</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0550AE;">null</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  {</span></span>
<span class="line"><span style="color:#24292F;">    resetOnExecute: </span><span style="color:#0550AE;">false</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">  },</span></span>
<span class="line"><span style="color:#24292F;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8250DF;">useIntervalFn</span><span style="color:#24292F;">(() </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">updateStatus</span><span style="color:#24292F;">(), </span><span style="color:#0550AE;">1000</span><span style="color:#24292F;">)</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">script</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">template</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;</span><span style="color:#116329;">div</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">h3</span><span style="color:#24292F;">&gt;Status&lt;/</span><span style="color:#116329;">h3</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">ul</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">v-if</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">status</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">      &lt;</span><span style="color:#116329;">li</span><span style="color:#24292F;">&gt;Blocks: {{ status.blocks }}&lt;/</span><span style="color:#116329;">li</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">      &lt;</span><span style="color:#116329;">li</span><span style="color:#24292F;">&gt;Uptime (sec): {{ status.uptime.secs }}&lt;/</span><span style="color:#116329;">li</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;/</span><span style="color:#116329;">ul</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;/</span><span style="color:#116329;">div</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">template</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>Ok, then let&#39;s build the CreateDomain component:</p><div class="language-vue"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">script</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">setup</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">lang</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;ts&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  BTreeMapAccountIdAccount,</span></span>
<span class="line"><span style="color:#24292F;">  BTreeMapAssetDefinitionIdAssetDefinitionEntry,</span></span>
<span class="line"><span style="color:#24292F;">  BTreeMapNameValue,</span></span>
<span class="line"><span style="color:#24292F;">  Domain,</span></span>
<span class="line"><span style="color:#24292F;">  EvaluatesToIdentifiableBox,</span></span>
<span class="line"><span style="color:#24292F;">  Executable,</span></span>
<span class="line"><span style="color:#24292F;">  Expression,</span></span>
<span class="line"><span style="color:#24292F;">  DomainId,</span></span>
<span class="line"><span style="color:#24292F;">  IdentifiableBox,</span></span>
<span class="line"><span style="color:#24292F;">  Instruction,</span></span>
<span class="line"><span style="color:#24292F;">  Metadata,</span></span>
<span class="line"><span style="color:#24292F;">  OptionIpfsPath,</span></span>
<span class="line"><span style="color:#24292F;">  RegisterBox,</span></span>
<span class="line"><span style="color:#24292F;">  Value,</span></span>
<span class="line"><span style="color:#24292F;">  VecInstruction,</span></span>
<span class="line"><span style="color:#24292F;">} </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { ref } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;vue&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { client } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;../client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">domainName</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">ref</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;&#39;</span><span style="color:#24292F;">)</span></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">isPending</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">ref</span><span style="color:#24292F;">(</span><span style="color:#0550AE;">false</span><span style="color:#24292F;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">async</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">function</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">register</span><span style="color:#24292F;">() {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">try</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">    isPending.value </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#CF222E;">await</span><span style="color:#24292F;"> client.</span><span style="color:#8250DF;">submit</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#8250DF;">Executable</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#0A3069;">&#39;Instructions&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#8250DF;">VecInstruction</span><span style="color:#24292F;">([</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#8250DF;">Instruction</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">            </span><span style="color:#0A3069;">&#39;Register&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">            </span><span style="color:#8250DF;">RegisterBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">              object: </span><span style="color:#8250DF;">EvaluatesToIdentifiableBox</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">                expression: </span><span style="color:#8250DF;">Expression</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">                  </span><span style="color:#0A3069;">&#39;Raw&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">                  </span><span style="color:#8250DF;">Value</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">                    </span><span style="color:#0A3069;">&#39;Identifiable&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">                    </span><span style="color:#8250DF;">IdentifiableBox</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">                      </span><span style="color:#0A3069;">&#39;Domain&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">                      </span><span style="color:#8250DF;">Domain</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">                        id: </span><span style="color:#8250DF;">DomainId</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">                          name: domainName.value,</span></span>
<span class="line"><span style="color:#24292F;">                        }),</span></span>
<span class="line"><span style="color:#24292F;">                        accounts: </span><span style="color:#8250DF;">BTreeMapAccountIdAccount</span><span style="color:#24292F;">(</span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Map</span><span style="color:#24292F;">()),</span></span>
<span class="line"><span style="color:#24292F;">                        metadata: </span><span style="color:#8250DF;">Metadata</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">                          map: </span><span style="color:#8250DF;">BTreeMapNameValue</span><span style="color:#24292F;">(</span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Map</span><span style="color:#24292F;">()),</span></span>
<span class="line"><span style="color:#24292F;">                        }),</span></span>
<span class="line"><span style="color:#24292F;">                        asset_definitions:</span></span>
<span class="line"><span style="color:#24292F;">                          </span><span style="color:#8250DF;">BTreeMapAssetDefinitionIdAssetDefinitionEntry</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">                            </span><span style="color:#CF222E;">new</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">Map</span><span style="color:#24292F;">(),</span></span>
<span class="line"><span style="color:#24292F;">                          ),</span></span>
<span class="line"><span style="color:#24292F;">                        logo: </span><span style="color:#8250DF;">OptionIpfsPath</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;None&#39;</span><span style="color:#24292F;">),</span></span>
<span class="line"><span style="color:#24292F;">                      }),</span></span>
<span class="line"><span style="color:#24292F;">                    ),</span></span>
<span class="line"><span style="color:#24292F;">                  ),</span></span>
<span class="line"><span style="color:#24292F;">                ),</span></span>
<span class="line"><span style="color:#24292F;">              }),</span></span>
<span class="line"><span style="color:#24292F;">            }),</span></span>
<span class="line"><span style="color:#24292F;">          ),</span></span>
<span class="line"><span style="color:#24292F;">        ]),</span></span>
<span class="line"><span style="color:#24292F;">      ),</span></span>
<span class="line"><span style="color:#24292F;">    )</span></span>
<span class="line"><span style="color:#24292F;">  } </span><span style="color:#CF222E;">finally</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">    isPending.value </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">false</span></span>
<span class="line"><span style="color:#24292F;">  }</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">script</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">template</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;</span><span style="color:#116329;">div</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">h3</span><span style="color:#24292F;">&gt;Create Domain&lt;/</span><span style="color:#116329;">h3</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">p</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">      &lt;</span><span style="color:#116329;">label</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">for</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;domain&quot;</span><span style="color:#24292F;">&gt;New domain name:&lt;/</span><span style="color:#116329;">label</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">      &lt;</span><span style="color:#116329;">input</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">id</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;domain&quot;</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">v-model</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">domainName</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;"> /&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;/</span><span style="color:#116329;">p</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">p</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">      &lt;</span><span style="color:#116329;">button</span><span style="color:#24292F;"> @</span><span style="color:#0550AE;">click</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">register</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">        Register domain{{ isPending </span><span style="color:#CF222E;">?</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;...&#39;</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;&#39;</span><span style="color:#24292F;"> }}</span></span>
<span class="line"><span style="color:#24292F;">      &lt;/</span><span style="color:#116329;">button</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;/</span><span style="color:#116329;">p</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;/</span><span style="color:#116329;">div</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">template</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>And finally, let&#39;s build the Listener component which will use Events API to setup live connection with a peer:</p><div class="language-vue"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">script</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">setup</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">lang</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;ts&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { SetupEventsReturn } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/client&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  PipelineEntityType,</span></span>
<span class="line"><span style="color:#24292F;">  EventFilter,</span></span>
<span class="line"><span style="color:#24292F;">  OptionPipelineEntityType,</span></span>
<span class="line"><span style="color:#24292F;">  OptionHash,</span></span>
<span class="line"><span style="color:#24292F;">  PipelineEventFilter,</span></span>
<span class="line"><span style="color:#24292F;">} </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  shallowReactive,</span></span>
<span class="line"><span style="color:#24292F;">  shallowRef,</span></span>
<span class="line"><span style="color:#24292F;">  computed,</span></span>
<span class="line"><span style="color:#24292F;">  onBeforeUnmount,</span></span>
<span class="line"><span style="color:#24292F;">} </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;vue&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { bytesToHex } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;hada&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { client } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;../client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">interface</span><span style="color:#24292F;"> </span><span style="color:#953800;">EventData</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#953800;">hash</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#953800;">status</span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">string</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">events</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">shallowReactive</span><span style="color:#24292F;">&lt;</span><span style="color:#953800;">EventData</span><span style="color:#24292F;">[]&gt;([])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">currentListener</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">shallowRef</span><span style="color:#24292F;">&lt;</span><span style="color:#0550AE;">null</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">|</span><span style="color:#24292F;"> </span><span style="color:#953800;">SetupEventsReturn</span><span style="color:#24292F;">&gt;(</span><span style="color:#0550AE;">null</span><span style="color:#24292F;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">const</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">isListening</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">computed</span><span style="color:#24292F;">(() </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">!!</span><span style="color:#24292F;">currentListener.value)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">async</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">function</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">startListening</span><span style="color:#24292F;">() {</span></span>
<span class="line"><span style="color:#24292F;">  currentListener.value </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">await</span><span style="color:#24292F;"> client.</span><span style="color:#8250DF;">listenForEvents</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">    filter: </span><span style="color:#8250DF;">EventFilter</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#0A3069;">&#39;Pipeline&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">      </span><span style="color:#8250DF;">PipelineEventFilter</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">        entity: </span><span style="color:#8250DF;">OptionPipelineEntityType</span><span style="color:#24292F;">(</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#0A3069;">&#39;Some&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">          </span><span style="color:#8250DF;">PipelineEntityType</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Transaction&#39;</span><span style="color:#24292F;">),</span></span>
<span class="line"><span style="color:#24292F;">        ),</span></span>
<span class="line"><span style="color:#24292F;">        hash: </span><span style="color:#8250DF;">OptionHash</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;None&#39;</span><span style="color:#24292F;">),</span></span>
<span class="line"><span style="color:#24292F;">      }),</span></span>
<span class="line"><span style="color:#24292F;">    ),</span></span>
<span class="line"><span style="color:#24292F;">  })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">  currentListener.value.ee.</span><span style="color:#8250DF;">on</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;event&#39;</span><span style="color:#24292F;">, (</span><span style="color:#953800;">event</span><span style="color:#24292F;">) </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">    </span><span style="color:#CF222E;">const</span><span style="color:#24292F;"> { </span><span style="color:#0550AE;">hash</span><span style="color:#24292F;">, </span><span style="color:#0550AE;">status</span><span style="color:#24292F;"> } </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> event.</span><span style="color:#8250DF;">as</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;Pipeline&#39;</span><span style="color:#24292F;">)</span></span>
<span class="line"><span style="color:#24292F;">    events.</span><span style="color:#8250DF;">push</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">      hash: </span><span style="color:#8250DF;">bytesToHex</span><span style="color:#24292F;">([</span><span style="color:#CF222E;">...</span><span style="color:#24292F;">hash]),</span></span>
<span class="line"><span style="color:#24292F;">      status: status.</span><span style="color:#8250DF;">match</span><span style="color:#24292F;">({</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#8250DF;">Validating</span><span style="color:#24292F;">: () </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;validating&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#8250DF;">Committed</span><span style="color:#24292F;">: () </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;committed&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">        </span><span style="color:#8250DF;">Rejected</span><span style="color:#24292F;">: (</span><span style="color:#953800;">_reason</span><span style="color:#24292F;">) </span><span style="color:#CF222E;">=&gt;</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;rejected with some reason&#39;</span><span style="color:#24292F;">,</span></span>
<span class="line"><span style="color:#24292F;">      }),</span></span>
<span class="line"><span style="color:#24292F;">    })</span></span>
<span class="line"><span style="color:#24292F;">  })</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">async</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">function</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">stopListening</span><span style="color:#24292F;">() {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#CF222E;">await</span><span style="color:#24292F;"> currentListener.value?.</span><span style="color:#8250DF;">stop</span><span style="color:#24292F;">()</span></span>
<span class="line"><span style="color:#24292F;">  currentListener.value </span><span style="color:#CF222E;">=</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">null</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8250DF;">onBeforeUnmount</span><span style="color:#24292F;">(stopListening)</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">script</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">template</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;</span><span style="color:#116329;">div</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">h3</span><span style="color:#24292F;">&gt;Listening&lt;/</span><span style="color:#116329;">h3</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">p</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">      &lt;</span><span style="color:#116329;">button</span><span style="color:#24292F;"> @</span><span style="color:#0550AE;">click</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">isListening </span><span style="color:#CF222E;">?</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">stopListening</span><span style="color:#24292F;">() </span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#8250DF;">startListening</span><span style="color:#24292F;">()</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">        {{ isListening </span><span style="color:#CF222E;">?</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;Stop&#39;</span><span style="color:#24292F;"> </span><span style="color:#CF222E;">:</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;Listen&#39;</span><span style="color:#24292F;"> }}</span></span>
<span class="line"><span style="color:#24292F;">      &lt;/</span><span style="color:#116329;">button</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;/</span><span style="color:#116329;">p</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">p</span><span style="color:#24292F;">&gt;Events:&lt;/</span><span style="color:#116329;">p</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">    &lt;</span><span style="color:#116329;">ul</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">      &lt;</span><span style="color:#116329;">li</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">v-for</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">{ hash, status } </span><span style="color:#CF222E;">in</span><span style="color:#24292F;"> events</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;"> :</span><span style="color:#0550AE;">key</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">hash</span><span style="color:#0A3069;">&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">        Transaction &lt;</span><span style="color:#116329;">code</span><span style="color:#24292F;">&gt;{{ hash }}&lt;/</span><span style="color:#116329;">code</span><span style="color:#24292F;">&gt; status:</span></span>
<span class="line"><span style="color:#24292F;">        {{ status }}</span></span>
<span class="line"><span style="color:#24292F;">      &lt;/</span><span style="color:#116329;">li</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">    &lt;/</span><span style="color:#116329;">ul</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;/</span><span style="color:#116329;">div</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">template</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>That\u2019s it! Now we should only wrap it up with the App.vue component and app entrypoint:</p><div class="language-vue"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">script</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">setup</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">lang</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;ts&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> CreateDomain </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;./components/CreateDomain.vue&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> Listener </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;./components/Listener.vue&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> StatusChecker </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;./components/StatusChecker.vue&#39;</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">script</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">template</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;</span><span style="color:#116329;">StatusChecker</span><span style="color:#24292F;"> /&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;</span><span style="color:#116329;">hr</span><span style="color:#24292F;"> /&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;</span><span style="color:#116329;">CreateDomain</span><span style="color:#24292F;"> /&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;</span><span style="color:#116329;">hr</span><span style="color:#24292F;"> /&gt;</span></span>
<span class="line"><span style="color:#24292F;">  &lt;</span><span style="color:#116329;">Listener</span><span style="color:#24292F;"> /&gt;</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">template</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292F;">&lt;</span><span style="color:#116329;">style</span><span style="color:#24292F;"> </span><span style="color:#0550AE;">lang</span><span style="color:#24292F;">=</span><span style="color:#0A3069;">&quot;scss&quot;</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"><span style="color:#0550AE;">#app</span><span style="color:#24292F;"> {</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0550AE;">padding</span><span style="color:#24292F;">: </span><span style="color:#0550AE;">16</span><span style="color:#CF222E;">px</span><span style="color:#24292F;">;</span></span>
<span class="line"><span style="color:#24292F;">  </span><span style="color:#0550AE;">font-family</span><span style="color:#24292F;">: </span><span style="color:#0550AE;">sans-serif</span><span style="color:#24292F;">;</span></span>
<span class="line"><span style="color:#24292F;">}</span></span>
<span class="line"><span style="color:#24292F;">&lt;/</span><span style="color:#116329;">style</span><span style="color:#24292F;">&gt;</span></span>
<span class="line"></span></code></pre></div><div class="language-ts"><pre class="shiki shiki-light" style="background-color:#ffffff;"><code><span class="line"><span style="color:#6E7781;">// main.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> { createApp } </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;vue&#39;</span></span>
<span class="line"><span style="color:#CF222E;">import</span><span style="color:#24292F;"> App </span><span style="color:#CF222E;">from</span><span style="color:#24292F;"> </span><span style="color:#0A3069;">&#39;./App.vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8250DF;">createApp</span><span style="color:#24292F;">(App).</span><span style="color:#8250DF;">mount</span><span style="color:#24292F;">(</span><span style="color:#0A3069;">&#39;#app&#39;</span><span style="color:#24292F;">)</span></span>
<span class="line"></span></code></pre></div><p>Here is a small demo with usage of this component:</p><div class="border border-solid border-gray-300 rounded-md shadow-md"><p><img src="`+p+'" alt=""></p></div>',77),t=[e];function c(r,y,i,F,d,u){return a(),n("div",null,t)}var f=s(o,[["render",c]]);export{g as __pageData,f as default};
