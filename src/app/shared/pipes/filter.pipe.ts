import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {

  /**
   * Filters an array of items based on a search term and specified keys.
   *
   * This method takes an array of objects and filters it by checking if the search term is included
   * in any of the specified keys of each object. It performs a case-insensitive search.
   *
   * @param {any[]} items - The array of items to be filtered.
   * @param {string} searchTerm - The term to search for in the item properties.
   * @param {string[]} keys - The list of keys in the items to be used for matching the search term.
   * @returns {any[]} The filtered array of items that match the search term in the specified keys.
   */
  public transform(items: any[], searchTerm: string, keys: string[]): any[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item =>
      keys.some(key =>
        item[key]?.toString().toLowerCase().includes(searchTerm)
      )
    );
  }
}
