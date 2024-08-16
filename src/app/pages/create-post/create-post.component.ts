import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { PostService } from '../../service/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {

  postForm!: FormGroup;
  tagStrings: string[]= [];

  constructor(private fb: FormBuilder,
    private router: Router,
    private snackBar : MatSnackBar,
    private postService: PostService,
  ){}

   ngOnInit() {
    this.postForm = this.fb.group({
      name: [null, Validators.required],
      contentString: [null, [Validators.required,Validators.maxLength(5000)]],
      imgString: [null, Validators.required],
      postedByString: [null, Validators.required],
    });
  }
  
  add(event:any){
    const value =(event.value || " ").trim();
    if(value){
      this.tagStrings.push(value);
      // this.postForm.patchValue({
      //   tagStrings: this.tagStrings
      // });
    }
    event.chipInput!.clear();
  }

  remove(tagString: string) {
    const index = this.tagStrings.indexOf(tagString);

    if (index >= 0) {
      this.tagStrings.splice(index, 1);
    }
  }

  createPost(){
    const data = this.postForm.value;
    data.tagStrings = this.tagStrings;

    this.postService.createNewPost(data).subscribe(res => {
      this.snackBar.open('Post created successfully', 'Dismiss', { duration: 2000 });
      this.router.navigateByUrl("/");
    }, error => {
      this.snackBar.open('Error creating post', 'Dismiss', { duration: 2000 });
    });
  }
}
