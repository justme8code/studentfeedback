import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    LogIn,
    UserPlus,
    ClipboardList,
    BookOpenCheck,
    MessageSquareText,
    BarChart3,
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white px-4 py-12 flex flex-col items-center">
            {/* Logo */}
            <img
                src="https://www.calebuniversity.edu.ng/caleb_uploads/2024/03/cropped-caleb-logoooonnnttt-180x180.png"
                alt="Caleb Logo"
                className="w-24 h-24 rounded-full bg-white p-2 mb-6"
            />

            {/* Header */}
            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">
                Caleb Student Feedback System
            </h1>
            <p className="text-lg text-purple-200 max-w-2xl text-center mb-10">
                Shape the future of learning. Your voice matters.
            </p>

            {/* About Section */}
            <div className="max-w-3xl text-center mb-12">
                <p className="text-md md:text-lg mb-4">
                    This platform enables Caleb University students to provide anonymous and honest feedback about their learning experiences, course delivery, and lecturers.
                </p>
                <p className="text-md md:text-lg mb-4">
                    Your feedback helps the university identify what’s working, what needs improvement, and how to build a better academic environment for everyone.
                </p>
                <p className="text-md md:text-lg">
                    Whether it’s praising great teaching or pointing out challenges, your insights are crucial.
                </p>
            </div>

            {/* Steps */}
            <div className="text-left max-w-xl mb-10">
                <h2 className="text-xl font-semibold mb-4 text-white">How it works:</h2>
                <ul className="space-y-4 text-purple-100">
                    <li className="flex items-center gap-3">
                        <LogIn className="text-purple-400" />
                        Log in with your student ID or sign up if you're new.
                    </li>
                    <li className="flex items-center gap-3">
                        <BookOpenCheck className="text-purple-400" />
                        Choose a course or lecturer to review.
                    </li>
                    <li className="flex items-center gap-3">
                        <MessageSquareText className="text-purple-400" />
                        Answer simple questions and submit your feedback.
                    </li>
                    <li className="flex items-center gap-3">
                        <BarChart3 className="text-purple-400" />
                        Your feedback goes directly to the academic board for review.
                    </li>
                </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
                <Link href="/auth">
                    <Button variant="default" size="lg">
                        <LogIn className="mr-2" /> Login
                    </Button>
                </Link>
                <Link href="/auth/sign-up">
                    <Button variant="outline" size="lg">
                        <UserPlus className="mr-2" /> Sign Up
                    </Button>
                </Link>
            </div>

            {/* Footer */}
            <div className="mt-16 text-sm text-purple-300 text-center">
                Powered by Caleb University — Built with ❤️ by students, for students.
            </div>
        </div>
    );
}
