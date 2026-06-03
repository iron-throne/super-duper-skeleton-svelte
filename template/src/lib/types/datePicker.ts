export interface ICalendarDate { day: number; from: 'current' | 'next' | 'prev', date: string, isDisabled: boolean }
export interface ICalendarOption {
    key: 'year'|'month',
    options: string[]|number[],
    value: number | string
}