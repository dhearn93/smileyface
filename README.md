# 😊.chat - Emoji-only Chat Application

A fun, real-time chat application where users can only communicate using emojis! Built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🎭 Emoji-only usernames and messages
- 🔄 Real-time messaging
- 📱 Fully responsive design
- 🎨 Modern UI with rounded elements and gradients
- ✨ Message history persistence
- 🔒 Input validation for emoji-only content

## Setup Instructions

1. Clone the repository:
\`\`\`bash
git clone https://github.com/dhearn93/smileyface.git
cd smileyface
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Create a new table called 'messages' with the following schema:
     ```sql
     create table messages (
       id text primary key,
       username text not null,
       content text not null,
       timestamp bigint not null
     );
     ```
   - Enable real-time for the messages table
   - Copy your project URL and anon key

4. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase project URL and anon key

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your repository
3. Add the environment variables from `.env.local`
4. Deploy!

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License

## Created by

[@dhearn93](https://github.com/dhearn93)
