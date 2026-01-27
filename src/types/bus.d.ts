/**
 * @import { EventsType } from '@/scripts/classes/Bus/consts'
 */

export class Bus {
  emit<K extends keyof EventsType>(event: K, data: EventsType[K]): void;
  on<K extends keyof EventsType>(
    event: K,
    callback: (data: EventsType[K]) => void,
  ): void;
}
