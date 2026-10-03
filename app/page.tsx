'use client'

import { useState } from "react";
import {
  ArrowRight, CheckCircle2, ChevronDown, Leaf, Menu, MessageCircle,
  Phone, Search, ShoppingBasket, Sprout, Tractor, X, MapPin, Star
} from "lucide-react";

const products = [
  { name: "Premium Paddy Seeds", category: "Seeds", price: "₹480 / pack", image: "https://images.unsplash.com/photo-1536633075091-8d3d1d3d1f1c?auto=format&fit=crop&w=900&q=80", tag: "Best Seller" },
  { name: "Organic Vegetable Seeds", category: "Seeds", price: "₹220 / pack", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80", tag: "Organic" },
  { name: "Neem Bio Fertilizer", category: "Fertilizers", price: "₹690 / 5 kg", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80", tag: "Eco Choice" },
  { name: "Drip Irrigation Kit", category: "Irrigation", price: "₹1,899 / kit", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?auto=format&fit=crop&w=900&q=80", tag: "Water Smart" },
];

const services = [
  ["🌱", "Crop Advisory", "Practical guidance for crop selection, nutrition, irrigation and seasonal planning."],
  ["💧", "Smart Irrigation", "Drip and water-management solutions designed to reduce wastage."],
  ["🚜", "Farm Solutions", "Modern tools, equipment and farm inputs for everyday field operations."],
  ["🤖", "AI Agriculture", "Smart crop and soil insights powered by connected sensors and AI."],
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    (p.name + p.category).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="site">
      <div className="topbar">
        <span>🌾 Trusted agriculture solutions for modern farmers</span>
        <span className="toplink">Serving farms across Tamil Nadu →</span>
      </div>

      <header className="nav">
        <a href="#home" className="brand">
          <span className="brandmark"><Sprout size={23}/></span>
          <span><b>AGRI</b><em>ROOT</em><small>FARM SOLUTIONS</small></span>
        </a>
        <button className="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
        <nav className={open ? "navlinks open" : "navlinks"}>
          {["Home","Products","Services","About","Contact"].map((x) =>
            <a key={x} href={"#" + x.toLowerCase()} onClick={() => setOpen(false)}>{x}</a>
          )}
          <a className="nav-cta" href="#contact">Enquire Now <ArrowRight size={16}/></a>
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Leaf size={15}/> GROW BETTER. FARM SMARTER.</div>
          <h1>Everything your<br/><span>farm needs</span>, in one place.</h1>
          <p>Quality seeds, trusted farm inputs, irrigation solutions and practical agriculture services — built around the real needs of farmers.</p>
          <div className="hero-actions">
            <a className="primary-btn" href="#products">Explore Products <ArrowRight size={18}/></a>
            <a className="text-btn" href="#contact"><Phone size={17}/> Talk to us</a>
          </div>
          <div className="trust-row">
            <div><strong>500+</strong><span>Farmers served</span></div>
            <div><strong>25+</strong><span>Farm solutions</span></div>
            <div><strong>100%</strong><span>Support focused</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card card-one"><Sprout/><b>Healthy crops</b><span>Better inputs • Better results</span></div>
          <div className="hero-card card-two"><span className="mini-dot"></span>Smart farming</div>
          <div className="hero-photo"></div>
          <div className="circle-stamp">GROW<br/><b>NATURALLY</b><br/>✦</div>
        </div>
      </section>

      <section className="ticker">
        <span>SEEDS</span><i>✦</i><span>FERTILIZERS</span><i>✦</i><span>IRRIGATION</span><i>✦</i><span>FARM TOOLS</span><i>✦</i><span>AI AGRICULTURE</span><i>✦</i>
      </section>

      <section id="products" className="section products">
        <div className="section-head">
          <div><div className="eyebrow">OUR CATALOGUE</div><h2>Farm essentials,<br/><span>carefully selected.</span></h2></div>
          <p>From the first seed to harvest-day support, discover dependable products for smarter farming.</p>
        </div>
        <div className="product-tools">
          <div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products..."/></div>
          <div className="product-count">{filtered.length} products</div>
        </div>
        <div className="product-grid">
          {filtered.map((p) => <article className="product-card" key={p.name}>
            <div className="product-image" style={{backgroundImage:"url(" + p.image + ")"}}><span>{p.tag}</span><button><ShoppingBasket size={18}/></button></div>
            <div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><div><b>{p.price}</b><a href="#contact">Enquire <ArrowRight size={14}/></a></div></div>
          </article>)}
        </div>
      </section>

      <section id="services" className="section services">
        <div className="section-head light"><div><div className="eyebrow">WHAT WE DO</div><h2>More than products.<br/><span>A partner for your farm.</span></h2></div><p>Simple, useful agriculture support — from farm inputs to modern technology.</p></div>
        <div className="service-grid">{services.map(([icon,title,text])=><article key={title} className="service-card"><div className="service-icon">{icon}</div><h3>{title}</h3><p>{text}</p><a href="#contact">Learn more <ArrowRight size={15}/></a></article>)}</div>
      </section>

      <section id="about" className="story">
        <div className="story-photo"></div>
        <div className="story-copy">
          <div className="eyebrow">ABOUT AGRIROOT</div>
          <h2>Rooted in farming.<br/><span>Built for the future.</span></h2>
          <p>We bring traditional farming knowledge and practical technology together so farmers can make confident day-to-day decisions.</p>
          <ul><li><CheckCircle2/> Quality-focused farm inputs</li><li><CheckCircle2/> Practical, farmer-first guidance</li><li><CheckCircle2/> Modern irrigation & IoT solutions</li></ul>
          <a className="primary-btn" href="#contact">Know our story <ArrowRight size={17}/></a>
        </div>
      </section>

      <section className="ai-band">
        <div className="ai-icon">✦</div>
        <div><div className="eyebrow">FUTURE OF FARMING</div><h2>Bring AI into your field.</h2><p>Connect soil sensors, crop observations and farm data to get useful insights in one place.</p></div>
        <a className="light-btn" href="#contact">Explore AI Agriculture <ArrowRight size={17}/></a>
      </section>

      <section id="contact" className="contact section">
        <div className="contact-card">
          <div><div className="eyebrow">LET'S TALK</div><h2>Have a farm requirement?<br/><span>We'd love to help.</span></h2><p>Tell us what you grow, what you need and where your farm is located.</p></div>
          <form onSubmit={e=>e.preventDefault()}>
            <input placeholder="Your name"/>
            <input placeholder="Phone number"/>
            <input placeholder="What do you need?"/>
            <textarea placeholder="Message"></textarea>
            <button className="primary-btn" type="submit">Send Enquiry <ArrowRight size={17}/></button>
          </form>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><span className="brandmark"><Sprout size={22}/></span><b>AGRIROOT</b><p>Smart solutions for growing farms.</p></div>
        <div className="footer-links"><a href="#products">Products</a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a></div>
        <div className="footer-contact"><span><MapPin size={15}/> Tamil Nadu, India</span><span><Phone size={15}/> +91 90000 00000</span><span><MessageCircle size={15}/> WhatsApp us</span></div>
        <div className="copyright">© 2026 AgriRoot Farm Solutions. All rights reserved.</div>
      </footer>
    </main>
  );
}
