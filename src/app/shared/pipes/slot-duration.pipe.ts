import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slotDuration',
  standalone: true
})
export class SlotDurationPipe implements PipeTransform {

  transform(startTimeString: string,duration:number): string {
    let startTime = new Date(`${new Date().toDateString()} ${startTimeString}`)    
    let endTime = new Date(startTime.getTime() + (duration* 60 * 1000))
      return `${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`
  }

}
