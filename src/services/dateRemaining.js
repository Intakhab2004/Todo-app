

export function dateRemaining(dueDate){

    const today = new Date();
    let dueText = "No due date";

    if(dueDate){
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        dueText = diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""} remaining` : `Task was due on ${due.toLocaleDateString("en-US", {
                                        month: "short", 
                                        day: "numeric", 
                                        year: "numeric",
                                    })}`
    }

    return dueText;
}


export function dateFormatter(createdAt){

    const createdDateStr = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })

    return createdDateStr;
}