export interface Criterion {
    id: number;
    name: string;
    weight: number;
    isActive?: boolean;
    description?: string;
    createdAt: Date;
}


export type CreateCriterionPayload = Omit<Criterion, 'id' | 'createdAt' | 'isActive'>;
export type UpdateCriterionPayload = Partial<CreateCriterionPayload>;


