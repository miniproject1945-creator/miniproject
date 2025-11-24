export const increamentDate = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate()+days);
    return newDate;
};

export const decreamentDate = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate()-days);
    return newDate;
};