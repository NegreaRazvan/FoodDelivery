import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm: string ='';
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | undefined;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['searchTerm'])
        this.searchTerm = params['searchTerm'];
    })

    //add debounce to the search
    //500 ms delay, and only change if the search term is distinct from the last value
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.search(term);
    });

  }

  //destructor to avoid memory leaks
  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.searchSubject.complete();
  }

  search(term: string):void {
    if (term) {
      this.router.navigateByUrl('/search/' + term).then(() => {
        //doesnt work yet
        //have the focus on the search bar after url change for better UX
          setTimeout(() => {
            this.searchInput.nativeElement.focus();
          }, 500);
        }
      );

    } else {
      //if it's empty, go back to no filter
      this.router.navigateByUrl('/').then(() => {
          setTimeout(() => {
            this.searchInput.nativeElement.focus();
          }, 500);
        }
      );
    }
  }

  onSearchTermChange(value: string): void {
    this.searchSubject.next(value);
  }

}
