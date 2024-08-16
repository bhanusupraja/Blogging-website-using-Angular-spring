import { Component } from '@angular/core';
import { PostService } from '../../service/post.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { response } from 'express';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from '../../service/comment.service';


@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent {

  postId: any;
  postData: any;
  commentForm!: FormGroup;
  comments: any;
  constructor(private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private matsnackBar: MatSnackBar,
    private fb: FormBuilder, 
    private CommentService: CommentService, // for form validation
  ){}

  

  ngOnInit() {
    //this.getPostById();
    this.postId = this.activatedRoute.snapshot.params['id'];
    console.log(this.postId);
    this.getPostById();

    this.commentForm = this.fb.group({
      postedBy: [null, Validators.required],
      content: [null, Validators.required]
      
    });
  }

  publishComment(){
    const postedBy = this.commentForm.get('postedBy')?.value;
    const content = this.commentForm.get('content')?.value;
    this.CommentService.createComment(this.postId,postedBy, content).subscribe(res => {
      this.matsnackBar.open('Comment posted successfully', 'Dismiss', { duration: 2000 });
      this.getCommentsByPost();
    }, error => {
      this.matsnackBar.open('Failed to post comment', 'Dismiss', { duration: 2000 });
    });
  }

  getPostById(){
    this.postService.getPostById(this.postId).subscribe(res => {
      
      this.postData = res;
      console.log(res);
      this.getCommentsByPost();
    }, error => {
      this.matsnackBar.open('Failed to fetch post', 'Close', { duration: 2000 });
    });
  }

  likePost(){
    this.postService.likePost(this.postId).subscribe(response => {
      this.matsnackBar.open('Post liked successfully', 'Dismiss', { duration: 2000 });
      this.getPostById();
    }, (error) => {
      this.matsnackBar.open('Failed to like post', 'Dismiss', { duration: 2000 });
    });
  }

  getCommentsByPost(){
    this.CommentService.getAllCommentsByPost(this.postId).subscribe(res => {
    this.comments = res;

    },error => {
      this.matsnackBar.open('Failed to fetch comments', 'Dismiss', { duration: 2000 });
    });
  }
}
