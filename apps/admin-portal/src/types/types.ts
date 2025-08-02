/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AssessmentRecord {
    id: string;
    date: string;
    status: string;
    completedBy: string;
    [key: string]: any; // Add this line to allow dynamic properties
}