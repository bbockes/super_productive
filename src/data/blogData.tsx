import React, { lazy } from 'react';
export const categories = [{
  name: 'All',
  color: 'bg-gray-800'
}, {
  name: 'Content',
  color: 'bg-red-500'
}, {
  name: 'SEO',
  color: 'bg-green-500'
}, {
  name: 'Sales',
  color: 'bg-blue-500'
}, {
  name: 'Social',
  color: 'bg-pink-500'
}, {
  name: 'Ads',
  color: 'bg-yellow-500'
}, {
  name: 'Copywriting',
  color: 'bg-purple-500'
}, {
  name: 'Landing Page',
  color: 'bg-orange-500'
}, {
  name: 'Brand',
  color: 'bg-indigo-500'
}, {
  name: 'Creative',
  color: 'bg-teal-500'
}];
export const blogPosts = [{
  id: 1,
  title: "Lizzy's email worked on me",
  excerpt: 'A breakdown of how a simple email got a 25% response rate',
  category: 'Sales',
  readTime: '1 min',
  image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop',
  content: "I got 97 cold emails last month.\n\nThe only one I replied to didn't ask me to.\n\nLizzy told me that's her secret.\n\n\"I stopped asking for a quick call and clarified I wasn't asking for anything. Responses went from 5% to 25%.\"\n\nDon't ask, don't get.\n\nBut sometimes, not asking gets you more than asking ever could.\n\nLizzy's approach was counterintuitive. Instead of the typical \"Can we hop on a 15-minute call?\" she wrote: \"I'm not asking for anything. Just wanted to share something that might help.\"\n\nShe then provided genuine value - a specific insight about their industry, a relevant case study, or a useful resource. No strings attached.\n\nThe psychology is brilliant. When someone explicitly says they're not asking for anything, our guard comes down. We're so used to being sold to that genuine helpfulness stands out.\n\nHer emails felt like advice from a friend, not a sales pitch from a stranger.\n\nThe results speak for themselves:\n- 5x higher response rate\n- More meaningful conversations\n- Higher conversion to actual meetings\n- Better quality prospects\n\nThe lesson? Sometimes the best way to get what you want is to stop asking for it. Lead with value, not with requests. Build trust before building business.\n\nLizzy's secret isn't really about email - it's about human psychology. We respond to people who help us, not people who want something from us."
}, {
  id: 2,
  title: 'The saleswoman closing 33% of cold pitches',
  excerpt: "JR Farr's approach to closing cold prospects with authenticity",
  category: 'Sales',
  readTime: '2 min',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
  content: 'JR Farr closes 33% of her cold pitches.\n\nHer secret? She doesn\'t pitch.\n\n"I ask questions and listen. Most salespeople talk too much."\n\nHer approach:\n1. Research the prospect thoroughly\n2. Ask about their biggest challenges\n3. Listen for pain points\n4. Offer solutions, not products\n\nThe result? Prospects feel heard, not sold to.\n\nJR spends 2-3 hours researching each prospect before making contact. She studies their company, recent news, LinkedIn posts, and industry trends. This isn\'t surface-level research - she goes deep.\n\n"When I call someone, I know more about their business challenges than most of their employees do," she explains.\n\nHer opening line is never about her product. Instead: "I noticed your company just expanded into the European market. What\'s been your biggest surprise so far?"\n\nThis immediately shifts the conversation from sales to consultation. The prospect starts talking about real challenges, not deflecting sales pitches.\n\nJR then employs what she calls "diagnostic questioning" - a series of probing questions that help prospects articulate problems they might not have fully recognized.\n\n"Most people know something isn\'t working, but they can\'t pinpoint exactly what. My job is to help them see the full picture."\n\nOnly after understanding the complete problem does she mention her solution. And even then, she frames it as one possible approach, not the only answer.\n\n"Would it be helpful if I showed you how Company X solved a similar challenge?"\n\nThe 33% close rate isn\'t about aggressive selling - it\'s about thorough understanding. When prospects feel truly heard and understood, they naturally want to work with you.'
}, {
  id: 3,
  title: 'Don\'t write "labels"...',
  excerpt: 'How removing labels from landing pages increased conversions by 40%',
  category: 'Landing Page',
  readTime: '30 secs',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
  content: 'A simple A/B test revealed something surprising.\n\nRemoving the word "labels" from form fields increased conversions by 40%.\n\nInstead of:\n- Name: [input field]\n- Email: [input field]\n\nThey used:\n- [Your name]\n- [Your email]\n\nThe difference? Ownership language makes users feel more invested in completing the form.\n\nThis discovery came from a SaaS company testing their signup flow. They were struggling with a 23% form completion rate and decided to test every element systematically.\n\nThe breakthrough came when they realized traditional form labels create psychological distance. "Name:" feels like a demand. "Your name" feels like a conversation.\n\nThe psychology runs deeper than just language. When we use possessive pronouns, we activate what researchers call the "endowment effect" - people value things more when they feel ownership over them.\n\n"Your email address" suggests the email belongs to the user. "Email:" treats it like data to be extracted.\n\nThey tested other variations:\n- "Enter your name" vs "Your name" (possessive won)\n- "Provide email" vs "Your email" (possessive won)\n- "Company name" vs "Your company" (possessive won)\n\nThe pattern was consistent across all fields. Possessive language outperformed neutral language by 35-45% in every test.\n\nThey also discovered that placeholder text worked better than labels entirely:\n- Instead of "Your name" above the field\n- Use "Enter your name here" inside the field\n\nThis reduced visual clutter while maintaining the psychological benefit of ownership language.\n\nThe lesson: Small words make big differences. Every piece of copy on your site either builds connection or creates distance. Choose words that make users feel ownership, not obligation.'
}, {
  id: 4,
  title: 'How can I do the ad without any adjectives?',
  excerpt: 'The power of constraint in creative advertising',
  category: 'Copywriting',
  readTime: '30 secs',
  image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=250&fit=crop',
  content: 'A creative director challenged his team:\n\n"Write this ad without using any adjectives."\n\nThe result was their most successful campaign.\n\nConstraints force creativity. When you can'
}, {
  id: 5,
  title: 'Two million clicks from one email',
  excerpt: 'The psychology behind viral email marketing',
  category: 'Copywriting',
  readTime: '1 min',
  image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
  content: 'One email generated 2 million clicks.\n\nThe secret? They made clicking feel like winning.\n\n"CLICK THIS BUTTON 500 TIMES TO WIN 50% OFF YOUR NEXT ORDER!"\n\nPeople love games. They love winning. They love feeling special.\n\nThis email combined all three into one irresistible call-to-action.\n\nThe company behind this was an e-commerce retailer struggling with email engagement. Their typical promotional emails got 2-3% click rates.\n\nThen they tried gamification.\n\nThe email looked like a simple game. A big red button with a counter that started at 0. Every click increased the number. The goal: reach 500 clicks to unlock the discount.\n\nBut here\'s the genius part - the counter was global. Everyone who clicked contributed to the same total. It became a community effort.\n\nPeople shared the email with friends: "Help us reach 500!" Social media posts appeared: "Only 50 clicks away from the discount!"\n\nThe psychology tapped into several powerful motivators:\n\n1. **Progress bars create urgency** - We\'re wired to complete things that are almost finished\n2. **Community goals build belonging** - Working together feels better than working alone\n3. **Games trigger dopamine** - Each click provided a small reward\n4. **Scarcity drives action** - Limited-time offers activate loss aversion\n\nThe email reached 500 clicks in 3 hours. But people kept clicking. The counter hit 2,847 before they stopped it.\n\nResults:\n- 47% open rate (vs 18% average)\n- 34% click rate (vs 3% average)\n- 156% increase in sales that week\n- 23% of recipients shared the email\n\nThe lesson: Don\'t just send emails. Create experiences. People don\'t engage with promotions - they engage with games, stories, and communities.'
}, {
  id: 6,
  title: '10% of ARR from typo domains',
  excerpt: 'How typo domains became an unexpected revenue stream',
  category: 'Creative',
  readTime: '30 secs',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
  content: "A SaaS company discovered 10% of their ARR came from typo domains.\n\nPeople misspell their domain name and land on competitor sites.\n\nTheir solution: Buy common typos of their domain and redirect to their site.\n\nResult: 10% increase in ARR from traffic they were already losing.\n\nSometimes the best growth hacks are the most obvious ones.\n\nThe discovery happened by accident. Their analytics showed traffic from domains they didn't recognize. Investigating further, they found dozens of misspelled versions of their domain name.\n\nSome led to competitor sites. Others were parked domains showing ads. A few were completely unrelated businesses that happened to match the typo.\n\nThey realized they were bleeding potential customers to simple spelling mistakes.\n\nThe most common typos for their domain \"marketflow.com\" were:\n- marketfow.com (missing 'l')\n- marketflo.com (missing 'w')\n- maketflow.com (missing 'r')\n- marketflw.com (missing 'o')\n\nThey bought 47 typo variations for $1,200 total and set up automatic redirects to their main site.\n\nThe impact was immediate:\n- 15% increase in direct traffic\n- 23% reduction in bounce rate from organic search\n- $127,000 additional ARR in the first year\n\nBut the real insight came from analyzing the typo traffic. These weren't random visitors - they were people specifically looking for their product who just couldn't spell the domain correctly.\n\nThe conversion rate from typo domains was actually higher than their main site because the intent was so strong.\n\nThey expanded the strategy:\n- Bought typos of competitor domains\n- Created helpful landing pages instead of direct redirects\n- Used typo domains for specific campaigns\n\nThe lesson: Your customers are trying to find you. Make sure they can, even when they make mistakes."
}];
export const aboutPost = {
  id: 'about',
  title: 'About Super Productive',
  excerpt: 'Tech hacks and productivity insights to help you work smarter',
  category: 'About',
  readTime: '1 min',
  image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop',
  content: "Super Productive is your go-to resource for actionable insights in tech and productivity.\n\nOur mission is to help professionals work smarter, not harder. We curate and analyze the most effective strategies, tools, and methodologies from industry leaders.\n\nEvery article is carefully crafted to provide practical, implementable advice that you can use immediately to improve your workflow and boost your productivity.\n\nWhether you're a startup founder, marketing professional, or tech enthusiast, you'll find valuable insights to level up your game.\n\nJoin thousands of readers who are already working smarter with Super Productive."
};