import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slotDuration',
  standalone: true
})
export class SlotDurationPipe implements PipeTransform {

  transform(startTimeString: string,duration:number): string {
    let startTime = new Date(`${new Date().toDateString()} ${startTimeString}`)    
    let endTime = new Date(startTime.getTime() + (duration* 60 * 1000))
    const options = { hour: '2-digit', minute: '2-digit' } as const;

      return `${startTime.toLocaleTimeString([],options)} to ${endTime.toLocaleTimeString([],options)}`
  }

}
