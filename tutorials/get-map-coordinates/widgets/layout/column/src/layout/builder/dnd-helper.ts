export function  calInsertPositionForColumn(
  boundingRect: ClientRect,
  itemRect: Partial<ClientRect>,
  childRects: Array<ClientRect & {id: string}>
): {insertY: number, refId: string} {
  const centerY = itemRect.top + itemRect.height / 2;
  let result;
  let refId;
  let found = false;
  childRects.some((rect, i) => {
    const rectY = rect.top + rect.height / 2;
    if (rectY > centerY) {
      if (i === 0) { // insert before the first item
        result = rect.top / 2;
      } else { // insert between this and previous one
        const previousItem = childRects[i - 1];
        result = (rect.top + previousItem.top + previousItem.height) / 2;
      }
      found = true;
      refId = rect.id;
    }
    return found;
  });
  if (!found) { // insert after the last one
    const lastItem = childRects[childRects.length - 1];
    result = (lastItem.top + lastItem.height + boundingRect.height) / 2;
  }
  return {
    refId,
    insertY: result,
  };
}
