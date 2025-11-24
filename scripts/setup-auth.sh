#!/bin/bash

echo "🔐 Setting up Production-Level Authentication for Hefica"
echo "=========================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  Please update the following in .env:"
    echo "   - DATABASE_URL (your PostgreSQL connection string)"
    echo "   - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
    echo "   - RESEND_API_KEY (get from https://resend.com)"
    echo "   - FROM_EMAIL (your verified domain or use onboarding@resend.dev for testing)"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

echo "1️⃣  Installing dependencies..."
npm install
echo ""

echo "2️⃣  Generating Prisma Client..."
npx prisma generate || PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
echo ""

echo "3️⃣  Running database migrations..."
npx prisma migrate dev || npx prisma db push
echo ""

echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Review AUTH_SETUP.md for detailed documentation"
echo "   2. Get a Resend API key from https://resend.com"
echo "   3. Update your .env file with the API key"
echo "   4. Run: npm run dev"
echo "   5. Test signup flow at http://localhost:3000"
echo ""
echo "🔒 Security features enabled:"
echo "   ✓ Email verification"
echo "   ✓ Password reset flow"
echo "   ✓ Account lockout (5 failed attempts)"
echo "   ✓ Rate limiting"
echo "   ✓ Strong password requirements"
echo "   ✓ Security logging"
echo ""
