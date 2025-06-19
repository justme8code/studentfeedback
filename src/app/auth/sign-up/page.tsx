import { SignUpPage } from '@/components/auth/SignUpPage';
import AuthLayout from "@/components/layout/AuthLayout";


export default function SignUpRoutePage() {
    return (
        <AuthLayout>
            <SignUpPage />
        </AuthLayout>
    );
}
