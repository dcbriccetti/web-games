function start() {
  const container = document.querySelector("#container")
  const newItems: HTMLInputElement = document.querySelector('#new-items')

  function addItems(names: string[]) {
    names.forEach(name => {
      const item = document.createElement("div")
      item.classList.add('item')
      item.append(name)
      container.append(item)
    })
  }

  addItems('Cat Dog Monkey Bird'.split(' '))

  newItems.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addItems(newItems.value.split(' '))
      newItems.value = ''
    }
  })
}

