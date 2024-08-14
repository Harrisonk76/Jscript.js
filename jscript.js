


const CourseInfo = [{
    id: 451,
    course: "Introduction to JavaScript",
}];

const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "2023-11-15", 
            points_possible: 500
        }
    ]
};

const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

function getLearnerData(course, ag, submissions) {
    const learnerData = {};

    try {
        // Check if course ID matches
        if (ag.courseId !== course.id) {
            throw new Error("Course Ids do not match");
        }
    

        // Process each submission
        for (const submission of submissions) {
            try {
                const learnerId = submission.learner_id;
                const assignmentId = submission.assignment_id;
                const score = submission.submission.score;
                const submittedAt = new Date(submission.submission.submitted_at);

                // Find the assignment
                const assignment = ag.assignments.find(a => a.id === assignmentId);

                if (!assignment) {
                    console.error(`Assignment with ID ${assignmentId} not found`);
                    continue; // Skip to the next submission if assignment is not found
                }

                const dueAt = new Date(assignment.due_at);
                const pointsPossible = assignment.points_possible;

                // Calculate final score considering late submission
                let finalScore = score;
                if (submittedAt > dueAt) {
                    finalScore -= pointsPossible * 0.1; // Deduct 10% of possible points for late submission
                }

                // Initialize learner data if not present
                if (!learnerData[learnerId]) {
                    learnerData[learnerId] = {
                        id: learnerId,
                        avg: 0,
                        totalPoints: 0,
                        totalPossiblePoints: 0
                    };
                }

                // Update learner data with assignment percentage
                const percentage = (finalScore / pointsPossible) * 100;
                learnerData[learnerId][assignmentId] = percentage;

                // Update total points and possible points
                learnerData[learnerId].totalPoints += finalScore;
                learnerData[learnerId].totalPossiblePoints += pointsPossible;

            } catch (error) {
                console.error("An error occurred while processing a submission:", error.message);
                break; // Exit loop if there's an error processing an individual submission
            }
        }

        // Calculate average scores for each learner
        for (const learnerId in learnerData) {
            const learner = learnerData[learnerId];
            if (learner.totalPossiblePoints === 0) {
                learner.avg = 0; 
            } else {
                learner.avg = (learner.totalPoints / learner.totalPossiblePoints) * 100;
            }
            delete learner.totalPoints;
            delete learner.totalPossiblePoints;
        }

        return Object.values(learnerData);

    } catch (error) {
        console.error("An error occurred:", error.message);
        return [];
    }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
 