export function map(items: any[], changeItem: (item: any) => any): any[]
{
    const newArray = [];
    for (const item of items) {
        newArray.push(changeItem(item));
    }
    return newArray;
}