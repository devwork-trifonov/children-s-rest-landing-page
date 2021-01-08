import "../style/style.css"

function tabsActive(n) {
  let tabs = document.getElementsByClassName("tab"),
    tabsItems = document.getElementsByClassName("tabs__items"),
    more = document.getElementsByClassName("more"),
    moreAfter = document.getElementsByClassName("more-after"),
    h,
    translate

  function tabsChange(x) {
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("tab_active")
      tabsItems[i].style.display = "none"
    }
    tabs[x].classList.add("tab_active")
    tabsItems[x].style.display = "flex"
  }

  for (let i = 0; i < more.length; i++) {
    more[i].addEventListener("mouseover", () => {
      h = 6
      translate = 0
      for (let x = 0; x < 11; x++) {
        h++
        translate++
        moreAfter[i].style.height = `${h}px`
        moreAfter[i].style.transform = `translate(-50%, -${translate}px)`
      }
    })
    more[i].addEventListener("mouseout", () => {
      for (let x = h; x > 6; x--) {
        h--
        translate--
        moreAfter[i].style.height = `${h}px`
        moreAfter[i].style.transform = `translate(-50%, -${translate}px)`
      }
    })
  }
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", () => {
      tabsChange(i)
    })
  }
  tabsChange(n)
}
tabsActive(0)
