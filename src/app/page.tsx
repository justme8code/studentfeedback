'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BarChart3, Star } from "lucide-react";
import {Logo} from "@/components/Logo";


export default function Landing() {


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Logo/>
                        </div>
                        <Button onClick={() => window.location.href = '/auth'}>
                            Sign In
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Enhance Academic Excellence Through Feedback
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        A comprehensive platform for students, lecturers, and administrators to collaborate
                        on improving educational quality through structured feedback and analytics.
                    </p>
                    <div className="space-y-4">
                        <Button
                            size="lg"
                            className="academic-bg-primary hover:bg-blue-700"
                            onClick={() => window.location.href = '/auth'}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle>For Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Provide anonymous feedback on courses and lecturers through structured questionnaires.
                                Help improve your educational experience.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <BarChart3 className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle>For Lecturers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Access detailed analytics and KPIs about your teaching performance.
                                View feedback trends and improve your courses.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <Star className="h-6 w-6 text-purple-600" />
                            </div>
                            <CardTitle>For Administrators</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Manage feedback rounds, criteria, and get system-wide analytics.
                                Monitor lecturer performance and improve institutional quality.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Benefits Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Why Choose Our Platform?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Anonymous Feedback</h3>
                            <p className="text-gray-600 mb-4">
                                Students can provide honest feedback without fear of retaliation,
                                ensuring authentic insights for improvement.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Real-time Analytics</h3>
                            <p className="text-gray-600 mb-4">
                                Get immediate insights with comprehensive dashboards and visual analytics
                                to track performance trends.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customizable Criteria</h3>
                            <p className="text-gray-600 mb-4">
                                Define custom feedback criteria that align with your institution's
                                quality standards and goals.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Scheduled Rounds</h3>
                            <p className="text-gray-600 mb-4">
                                Organize feedback collection in structured rounds with defined
                                timeframes for systematic evaluation.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; 2024 Academic Feedback System. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
