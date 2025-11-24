import { format } from 'date-fns';
import { Calendar, Clock, Shield } from 'lucide-react';

interface HeroSectionProps {
    dueDate?: Date;
    estimatedTime: number;
}

export default function HeroSection({ dueDate, estimatedTime }: HeroSectionProps) {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center space-y-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        You've Been Invited to Contribute Your Expertise
                    </h1>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Your responses help evaluate the trustworthiness and readiness of this deployment.
                        Only the questions assigned to your role will appear.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        {dueDate && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">Due Date:</span>
                                <span>{format(new Date(dueDate), 'MMM dd, yyyy')}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">Estimated Time:</span>
                            <span>~{estimatedTime} minutes</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span className="font-medium">Confidential & Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
