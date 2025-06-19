// src/lib/mock-data.ts

import { Questionnaire2 } from "./schema";

// We now have an array of questionnaires to simulate a database collection
const mockQuestionnaires: Questionnaire2[] = [
    {
        "id": 1,
        "title": "Feedback for Computer Science (CSC 101)",
        "questions": [
            { "id": 1, "question_text": "Overall, how would you rate this course?", "question_type": "rating", "order": 1 },
            { "id": 2, "question_text": "How would you rate the clarity of the instructor's explanations?", "question_type": "slider", "order": 2 },
            { "id": 3, "question_text": "What did you like most about this course?", "question_type": "text", "order": 3 },
        ]
    },
    {
        "id": 2,
        "title": "Feedback for Advanced Algorithms (CSC 450)",
        "questions": [
            { "id": 4, "question_text": "How challenging were the problem sets?", "question_type": "rating", "order": 1 },
            { "id": 5, "question_text": "What could be improved about the course materials?", "question_type": "text", "order": 2 },
            { "id": 6, "question_text": "Rate the real-world applicability of the topics. (1=Not at all, 100=Very)", "question_type": "slider", "order": 3 }
        ]
    }
];

// This function simulates fetching data from your backend
export async function getQuestionnaireById(id: number): Promise<Questionnaire2 | undefined> {
    console.log(`SERVER: Fetching questionnaire with id: ${id}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockQuestionnaires.find(q => q.id === id);
}