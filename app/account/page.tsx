import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';
import DeleteAccountButton from './DeleteAccountButton';
import SignOutButton from './SignOutButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account — SquishyMind',
  description: 'Your SquishyMind profile, founder status, and account settings.',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_founder, created_at')
    .eq('id', user.id)
    .single();

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-3xl font-semibold mb-6">Account</h1>

        <section className="glass rounded-2xl p-6 mb-5">
          <h2 className="text-lg font-medium mb-3">Profile</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-[--text-dim]">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[--text-dim]">Member since</dt>
              <dd>{new Date(user.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </section>

        {profile?.is_founder && (
          <section className="glass rounded-2xl p-6 mb-5 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-pink-500/10">
            <h2 className="text-lg font-medium mb-2 text-amber-300">Founder Access</h2>
            <p className="text-sm text-[--text-dim] leading-relaxed">
              40% off Premium forever — locked in during beta.
            </p>
          </section>
        )}

        <section className="glass rounded-2xl p-6 mb-5">
          <h2 className="text-lg font-medium mb-3">Sign out</h2>
          <p className="text-sm text-[--text-dim] mb-4">End your session on this browser.</p>
          <SignOutButton />
        </section>

        <section className="glass rounded-2xl p-6 border-red-500/20">
          <h2 className="text-lg font-medium mb-2 text-red-300">Delete account</h2>
          <p className="text-sm text-[--text-dim] mb-4">
            Permanently deletes your account, all your mind maps, and all
            collaborator invites. No email confirmation. No undo.
          </p>
          <DeleteAccountButton />
        </section>

        <p className="text-center text-sm text-[--text-dim] mt-8">
          <Link href="/dashboard" className="underline">← Back to dashboard</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
